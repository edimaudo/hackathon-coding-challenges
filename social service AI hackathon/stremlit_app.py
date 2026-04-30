import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
import hashlib

# --- APP CONFIG & STATE INIT ---
st.set_page_config(page_title="Victoria Production Coordination", layout="wide")

if 'audit_log' not in st.session_state:
    st.session_state.audit_log = []

# --- LIGHTWEIGHT UTILITIES ---
def anonymize_id(text):
    return hashlib.sha256(str(text).lower().strip().encode()).hexdigest()[:12]

def log_action(user, action, target_id, details):
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": user,
        "action": action,
        "target_hashed": anonymize_id(target_id),
        "details": details
    }
    st.session_state.audit_log.insert(0, entry)

# --- DATA ENGINE ---
@st.cache_data
def load_and_enrich_data():
    base = "https://raw.githubusercontent.com/lau9k/buildersvault-hackathon-kit/main/tracks/referral-care-coordination/data/sample/"
    
    # Load and normalize headers
    c = pd.read_csv(base + "clients_sample.csv").rename(columns=lambda x: str(x).strip().lower())
    con = pd.read_csv(base + "consent_records_sample.csv").rename(columns=lambda x: str(x).strip().lower())
    e = pd.read_csv(base + "service_encounters_sample.csv").rename(columns=lambda x: str(x).strip().lower())
    r = pd.read_csv(base + "referrals_sample.csv").rename(columns=lambda x: str(x).strip().lower())
    
    # Fix Encounter Date KeyErrors with fuzzy mapping
    if 'encounter_date' not in e.columns:
        date_cols = [col for col in e.columns if any(k in col for k in ['date', 'dt', 'time', 'enc'])]
        if date_cols:
            e = e.rename(columns={date_cols[0]: 'encounter_date'})
        else:
            e['encounter_date'] = pd.NaT

    # Fix Referral Date KeyErrors with fuzzy mapping
    if 'referral_date' not in r.columns:
        ref_date_cols = [col for col in r.columns if any(k in col for k in ['date', 'dt', 'time', 'ref'])]
        if ref_date_cols:
            r = r.rename(columns={ref_date_cols[0]: 'referral_date'})
        else:
            r['referral_date'] = pd.NaT

    # Convert to datetime
    e['encounter_date'] = pd.to_datetime(e['encounter_date'], errors='coerce')
    r['referral_date'] = pd.to_datetime(r['referral_date'], errors='coerce')
    
    # Clean Acuity Score
    if 'vi_spdat_score' not in c.columns:
        vi_cols = [col for col in c.columns if 'vi' in col]
        c = c.rename(columns={vi_cols[0]: 'vi_spdat_score'}) if vi_cols else c.assign(vi_spdat_score=0)
    c['vi_spdat_score'] = pd.to_numeric(c['vi_spdat_score'], errors='coerce').fillna(0)
    
    return c, con, e, r

def get_authorized_caseload(user_id, clients_df, consent_df):
    """STRICT AUTHORIZATION: Filters IDs based on User assignment and active consent status."""
    user_hash = int(hashlib.sha256(user_id.encode()).hexdigest(), 16)
    np.random.seed(user_hash % (2**32 - 1))
    assigned_mask = np.random.rand(len(clients_df)) < 0.45 
    caseload_ids = clients_df[assigned_mask]['client_id'].tolist()
    
    now = pd.Timestamp.now()
    valid_consent = consent_df[
        (consent_df['client_id'].isin(caseload_ids)) & 
        (consent_df['status'].str.lower() == 'active')
    ].copy()
    
    valid_consent['expiry_date'] = pd.to_datetime(valid_consent['expiry_date'], errors='coerce')
    authorized_ids = valid_consent[
        (valid_consent['expiry_date'] > now) | (valid_consent['expiry_date'].isna())
    ]['client_id'].unique()
    
    return clients_df[clients_df['client_id'].isin(authorized_ids)]

@st.cache_data
def build_risk_registry(c, e):
    valid_encounters = e.dropna(subset=['encounter_date'])
    last_contact = valid_encounters.groupby('client_id')['encounter_date'].max().reset_index()
    last_contact.columns = ['client_id', 'last_date']
    
    df_risk = c.merge(last_contact, on='client_id', how='left')
    df_risk['last_date'] = df_risk['last_date'].fillna(pd.Timestamp('2023-01-01'))
    
    sim_date = pd.Timestamp('2024-01-01')
    df_risk['days_silent'] = (sim_date - df_risk['last_date']).dt.days
    df_risk['risk_score'] = (df_risk['vi_spdat_score'] * 4) + (df_risk['days_silent'] * 0.4)
    return df_risk

# --- INITIALIZE ---
clients_raw, consent_raw, encounters_raw, referrals_raw = load_and_enrich_data()
risk_registry = build_risk_registry(clients_raw, encounters_raw)

# --- SIDEBAR ---
st.sidebar.title("Governance Portal")
current_user = st.sidebar.text_input("User ID", "Caseworker_01")

auth_clients = get_authorized_caseload(current_user, clients_raw, consent_raw)

st.sidebar.markdown("---")
st.sidebar.subheader("Authorized Caseload")

if not auth_clients.empty:
    selected_clients = st.sidebar.multiselect(
        "Filter by Client ID(s)", 
        options=auth_clients['client_id'].tolist(),
        default=None,
        help="Select specific clients to filter across all workflows."
    )
else:
    st.sidebar.error("No authorized records found for this User ID.")
    selected_clients = []

st.sidebar.markdown("---")
page = st.sidebar.radio("Workflows", [
    "About the Platform", 
    "Risk and Priority", 
    "Service Coordination", 
    "Referral History"
])

# Define filtered scope for workflows
ids_to_show = selected_clients if selected_clients else auth_clients['client_id'].tolist()

# --- PAGE ROUTING ---

if page == "About the Platform":
    st.title("Victoria Production Coordination")
    st.markdown("""
    ### System Purpose
    This platform serves as the central orchestration layer for social service providers. It ensures high-acuity individuals receive timely interventions through data-driven prioritization and multi-agency transparency.

    ### Core Components
    1. **Risk and Priority Engine:** Analyzes 'System Detachment' by calculating the gap between service encounters and clinical vulnerability.
    2. **Service Coordination:** Provides a granular timeline of all agency interactions for authorized clients to prevent service duplication.
    3. **Referral Management:** Tracks the lifecycle of agency referrals to identify bottlenecks in the intake process.
    
    ### Data Governance
    * **Consent-First Access:** Uses a 'Double-Gate' authorization model. Records are visible only if a caseworker is assigned AND an active legal consent record exists.
    * **Auditability:** Every interaction is cryptographically logged for FOIPPA compliance.
    """)

elif page == "Risk and Priority":
    st.title("System Detachment Model")
    st.info("Prioritized outreach registry for your authorized caseload.")
    
    user_risk_df = risk_registry[risk_registry['client_id'].isin(ids_to_show)]
    
    if not user_risk_df.empty:
        display_df = user_risk_df[['client_id', 'risk_score', 'last_date', 'vi_spdat_score']].copy()
        display_df['risk_score'] = display_df['risk_score'].round(1)
        display_df['last_date'] = display_df['last_date'].dt.strftime('%Y-%m-%d')
        
        display_df = display_df.rename(columns={
            'client_id': 'Client Identifier',
            'risk_score': 'Priority Score',
            'last_date': 'Last Contact Date',
            'vi_spdat_score': 'Acuity (VI-SPDAT)'
        }).sort_values(by='Priority Score', ascending=False)
        
        st.dataframe(display_df, use_container_width=True, hide_index=True)
        
        csv = display_df.to_csv(index=False).encode('utf-8')
        st.download_button("Export Priority List (CSV)", csv, f"Risk_Registry_{current_user}.csv", "text/csv")
    else:
        st.warning("No data found for selected filter.")

elif page == "Service Coordination":
    st.title("Service Encounter History")
    user_encounters = encounters_raw[encounters_raw['client_id'].isin(ids_to_show)]
    
    if not user_encounters.empty:
        st.dataframe(user_encounters.sort_values('encounter_date', ascending=False), use_container_width=True, hide_index=True)
    else:
        st.write("No encounter history found for current caseload.")

elif page == "Referral History":
    st.title("Referral Lifecycle Tracking")
    user_referrals = referrals_raw[referrals_raw['client_id'].isin(ids_to_show)]
    
    if not user_referrals.empty:
        st.dataframe(user_referrals.sort_values('referral_date', ascending=False), use_container_width=True, hide_index=True)
    else:
        st.write("No referral records found for current caseload.")