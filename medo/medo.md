# Medo


## Smithory --> https://www.appsmith.com/template/inventory-management-dashboard
Please design and develop a comprehensive multi-warehouse inventory management application named "Smithory". The core objective is to allow businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations.  Follow these detailed specifications for the build:  
**1. Core Application Identity & Framework** * **Application Name:** "Smithory". This title must be left-aligned and consistently displayed at the top of every page. 
* **Technology Stack:** Utilize a single database backend with multiple frontend views/panels. 
* **Accessibility & Responsiveness:** All views must be fully responsive and adhere to accessibility best practices (WCAG guidelines).  
**2. Visual & User Interface Design** * **Color Palette:** Primary color scheme based on Light Blue. Design must be adaptable for a Light Theme and a Dark Theme. 
* **Typography:** Primary font families: Inter, Helvetica, or Century Schoolbook. The application must include a user-controlled font size selector with three presets: Small, Medium, and Large. * **Layout & Navigation:** * Implement a persistent collapsible "hamburger" menu on the left-hand side of the screen for primary navigation between views. * The main content area will change dynamically based on the selected view from the menu.  
**3. User Authentication System** * A dedicated login screen with fields for Username and Password. * Functionality for new users to Sign Up for an account. * Secure session management post-login.  
**4. Core Functional Views & Modules** Design the following key views, accessible via the main navigation menu. Each view should have a clean, data-focused interface suitable for business operations.  
* **Dashboard View:** * Provide an overview of key inventory metrics (e.g., total stock value, low-stock alerts, recent activities) aggregated across all warehouses. 
* **Products Management View:** * Create, read, update, and delete (CRUD) product records. * For each product, track: SKU, Name, Description, Category, Cost Price, Selling Price. * Set and visualize a **Reorder Point** per product. The system should highlight products where current stock is at or below this point. 
* **Multi-Warehouse Inventory View:** * Display a master list of all warehouses/locations. * For each warehouse, show detailed stock levels for all products housed there. * Visual indicators for stock status: "In Stock", "Low Stock" (at/below reorder point), "Out of Stock". 
* **Suppliers Management View:** * CRUD operations for supplier information (Company Name, Contact, Address, Terms). * Link suppliers to the specific products they supply. 
* **Purchase Orders (PO) Management View:** * Generate new Purchase Orders, ideally with semi-automated creation triggered by low-stock alerts. * Each PO should be associated with a specific supplier and list products, quantities, and expected costs. * Track PO status: Draft, Sent, Partially Received, Completed. 
* **Stock Receiving View:** * Record the receipt of goods against an open Purchase Order. * Update the inventory count for the specified product in the designated warehouse upon confirmation of receipt. 
* **Stock Transfer View:** * Initiate and track the movement of stock quantities of a specific product from one warehouse to another. * Record transfer date, quantities, source warehouse, and destination warehouse.  
**5. Deliverables** Please provide a complete development plan including: * A proposed database schema (list of core tables and their relationships). * Wireframes or mockups for the key views (Dashboard, Products, Inventory, Purchase Orders), illustrating the layout with the left-aligned title, hamburger menu, and responsive design. * A detailed technical specification outlining the frontend components, backend API endpoints for each module, and state management approach for themes/font size.

## Write up
## Inspiration
I had a friend who wanted to get experiment with starting a retail clothing business.  He was not ready for how it would work yet but wanted to simulate some of the operational challenges before getting into it.  This is why I built Smithory. 
## What it does
Smithory is an easy to use Inventory Management app that enables businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations
## How we built it
I leveraged the power of Medo in building the application.  I first wrote down the features I wanted in the application in detail in a requirements document.  This included key features, font design, color scheme, light and dark mode and accessibility.  I then used the medo prompt optimization feature which helped to refine my requirements. I then  I then refined some of the UI elements based on what was created using the edit function.  I was very impressed with the ability to get majority of the features correct when listed in the requirements.md file.  It made building a breeze.

## Challenges we ran into
- There were no major challenges.  I had a clear idea of what I wanted to build and used medo to refine my prompt which made the work very easy.

## What's next for Smithory
Looking forward to seeing how it is embraced in the community.  In terms of features to add
- ability to use multi-currency
- multi-lingual support
- reverse logistics capabilibites
- ability to connect with warehouse systems

@Medo_CodeFree built Smithory (https://app-ayle1es4eadd.appmedo.com) an inventory app that allows businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations #BuiltWithMeDo

# Unbiased
App to help with tackling cognitive biases

Resources
--> https://thedecisionlab.com/biases
--> https://play.google.com/store/apps/details?id=cognitivebiases.thinking.psychology
--> https://play.google.com/store/apps/details?id=hr.anix.unbiased

## Prompt
Persona: web developer with neuroscience, game and service design experience
context: Building a web app called Unbiased that helps users sharpen the way they think.
Requirements

Design
- It should have a responsive design
- font would be inter or century schoolhouse
- color scheme would be navy blue themed
- It should be accessible. It should have the ability to change font sizes and have a dark and light mode.  The user should be able to change the mode but it should default to dark mode
- Should be able to get to every section using a hamburger menu
- It should have localization with ability to change languages.  The key languages would be English, French and Spanish

Views
Home View
It would two key sections.  top section and bottom section.  The top section would be a banner called bias of the day.  It would show the bias name and details about the bias in a card form.  It bottom section would have Three sections inside which would be side by side but properly spaced out.  Bias Explorer, Bias Detector and Settings.


Bias Explorer View
It should show a list of biases with their name and a high level overview in a card format.  When the user clicks on the card It should go to another page and show the bias name, details about the bias, Where this bias occurs, WHy it happens, WHy it matters, 3 examples of it, How it affects you, how it affects a business, How to avoid it.  Leverage https://thedecisionlab.com/biases to get the details

Bias Detector View
This is a quiz section where the user would be tested on their knowledge of biases.  There would be two types of quizzes, name that bias and bias checker.  For name that bias It would be They would be posed with 10 examples of biases.  The user would be posed with a challenge about a type of bias and would have to select the type of bias.  It would be a multiple choice question.  If the user selects the right answer it would be highlighted in green, if they select the wrong answer it would be highlighted in red.  For the bias checker game the user would be posed 10 questions and for each question leverage their understanding of biases.  Each question would be a scenario and the user would be given 3 options and would have to check.  it would be similar to the y-combinator paul graham bias test.

Settings
This would give the ability the change the design settings for the app


List of biases
AI Literacy Gap Why do we feel so confident using generative AI while our AI literacy lags behind?
Accountability diffusion in AI Why do AI systems make responsibility feel like no one’s job?
Action Bias Why do we prefer doing something to doing nothing?
Affect Heuristic Why do we rely on our current emotions when making quick decisions?
Ambiguity Effect Why do we prefer options we know?
Anchoring Bias Why do we compare everything to the first piece of information we received?
Attentional Bias Why do we focus more on some things than others?
Authority Bias Why do we always trust the doctor, even though they might be wrong?
Automation Bias Why do we accept the first plausible AI solution and stop searching?
Availability Heuristic Why do we tend to think that things that happened recently are more likely to happen again?
Bandwagon Effect Why do we support opinions as they become more popular?
Barnum Effect Why do we believe our horoscopes?
Base Rate Fallacy Why do we rely on specific information over statistics?
Belief Perseverance (The Backfire Effect) Why do we maintain the same beliefs, even when we are proved wrong?
Benjamin Franklin effect Why do we like someone more after doing them a favor?
Bikeshedding Why do we focus on trivial things?
Bottom-Dollar Effect Why do we transfer negative emotions about being broke on items that we purchase?
Bounded Rationality Why are we satisfied by “good enough?”
Bundling Bias Why do we value items purchased in a bundle less than those purchased individually?
Bye-Now Effect Why are we likely to spend more after reading the word “bye”?
Cashless Effect Why does paying without physical cash increase the likelihood that we purchase something?
Category Size Bias Why do we think we’re more likely to win at the big casino versus the small one?
Choice Overload Why do we have a harder time choosing when we have more options?
Cognitive Dissonance Why is it so hard to change someone's beliefs?
Commitment Bias Why do people support their past ideas, even when presented with evidence that they're wrong?
Confirmation Bias Why do we favor our existing beliefs?
Decision Fatigue Why do we make worse decisions at the end of the day?
Declinism Why do we think the past is better than the future?
Decoy Effect Why do we feel more strongly about one option after a third one is added?
Delegation Creep Why do we keep handing more decisions to AI?
Disposition Effect Why do we tend to hold on to losing investments?
Distinction Bias Why do we view options as more distinct when evaluating them simultaneously?
Dunning–Kruger Effect Why do we fail to accurately gauge our own abilities?
Einstellung Effect Why do our past experiences prevent us from reaching the best possible outcome?
Empathy Gap Why do we mispredict how much our emotions influence our behavior?
Endowment Effect Why do we value items more if they belong to us?
Extrinsic Incentive Bias Why do we think others are in it for the money, but we’re in it for the experience?
False Consensus Effect Why do we overestimate agreement?
Framing Effect Why do our decisions depend on how options are presented to us?
Functional Fixedness Why do we have trouble thinking outside the box?
Fundamental Attribution Error Why do we underestimate the influence of the situation on people’s behavior?
Gambler's Fallacy Why do we think a random event is more or less likely to occur if it happened several times in the past?
Google Effect Why do we forget information that we just looked up?
Halo Effect Why do positive impressions produced in one area positively influence our opinions in another area?
Hard-easy effect Why is our confidence disproportionate to the difficulty of a task?
Heuristics Why do we take mental shortcuts?
Hindsight Bias Why do unpredictable events only seem predictable after they occur?
Hot Hand Fallacy Why do we expect previous success to lead to future success?
Hyperbolic Discounting Why do we value immediate rewards more than long-term rewards?
IKEA Effect Why do we place disproportionately high value on things we helped to create?
Identifiable Victim Effect Why are we more likely to offer help to a specific individual than a vague group?
Illusion of Control Why do we think we have more control over the world than we do?
Illusion of Transparency Why do we feel that others can read our mind?
Illusion of Validity Why are we overconfident in our predictions?
Illusory Correlation Why do we think some things are related when they aren’t?
Illusory Truth Effect Why do we believe misinformation more easily when it’s repeated many times?
Impact Bias Why do we overestimate our emotional reactions to future events?
In-group Bias Why do we treat our in-group better than we do our out-group?
Incentivization Why do we work harder when we are promised a reward?
Just-world Hypothesis Why do we believe that we get what we deserve?
Lag Effect Why does spacing out the repetition of information make one more likely to remember it?
Law of the Instrument Why do we use the same skills everywhere?
Less-is-Better Effect Why do our preferences change depending on whether we judge our options together or separately?
Leveling and Sharpening Why do we exaggerate some details of a story, but minimize others?
Levels of Processing Why do we remember information that we attach significance to better than information we repeat?
Look-elsewhere Effect Why do scientists keep looking for a statistically significant result after failing to find one initially?
Loss Aversion Why do we buy insurance?
Mental Accounting Why do we think less about some purchases than others?
Mere Exposure Effect Why do we prefer things that we are familiar with?
Messenger Effect Why do we find some people more credible than others?
Motivating Uncertainty Effect Why are we more motivated by rewards of unknown sizes?
Naive Allocation Why do we prefer to spread limited resources across our options?
Naive Realism Why do we believe we have an objective understanding of the world?
Negativity Bias Why is the news always so depressing?
Noble Edge Effect Why do we tend to favor brands that show care for societal issues?
Normalcy Bias Why do we believe that nothing bad is going to happen?
Nostalgia Effect How do our sentimental feelings for the past influence our actions in the present?
Observer Expectancy Effect Why do we change our behavior when we’re being watched?
Omission Bias Why don’t we pull the trolley lever?
Optimism Bias Why do we overestimate the probability of success?
Ostrich Effect Why do we prefer to ignore negative information?
Outcome bias Why do we judge decisions by results alone?
Overjustification Effect Why do we lose interest in an activity after we are rewarded for it?
Parasocial Trust in AI Why do human-like AI chats make us overshare and obey?
Peak-end Rule How do our memories differ from our experiences?
Pessimism bias Why do we think we’re destined to fail?
Planning Fallacy Why do we underestimate how long it will take to complete a task?
Pluralistic Ignorance Why do we think our beliefs are different from the majority?
Present Bias Why does timing shape how much value we assign to rewards?
Primacy Effect Why do we only remember the first things on our grocery list?
Priming Why do some ideas prompt other ideas later on without our conscious awareness?
Projection Bias Why do we think our current preferences will remain the same in the future?
Reactive devaluation Why is negotiation so difficult?
Recency Effect Why do we better remember items at the end of a list?
Regret Aversion Why do we anticipate regret before we make a decision?
Representativeness Heuristic Why do we use similarity to gauge statistical probability?
Response Bias Why do we give false survey responses?
Restraint Bias Why do we overestimate our self-control?
Rosy Retrospection Why do we think the good old days were so good?
Salience Bias Why do we focus on items or information that are more prominent and ignore those that are not?
Self-serving Bias Why do we blame external factors for our own mistakes?
Serial Position Effect Why do we better remember items at the beginning or end of a list?
Sexual Overperception Bias Why do men think that women are always flirting with them?
Social Norms Why do we follow the behavior of others?
Source Confusion Why do we forget where our memories come from?
Spacing Effect Why do we retain information better when we learn it over a long time period?
Spotlight Effect Why do we feel like we stand out more than we really do?
Status Quo Bias Why do we tend to leave things as they are?
Suggestibility Why are we swayed by those around us?
Survivorship Bias Why do we misjudge groups by only looking at specific group members?
Take-the-best Heuristic Why do we focus on one characteristic to compare when choosing between alternatives?
Telescoping Effect Why do some things “seem like they just happened yesterday?”
The Illusion of Explanatory Depth Why do we think we understand the world more than we actually do?
The Pygmalion effect Why do we perform better when someone has high expectations of us?
The Sunk Cost Fallacy Why are we likely to continue with an investment even if it would be rational to give it up?
Zero Risk Bias Why do we seek certainty in risky situations?


## Write up

Explain how you used MeDo and highlight the best part it generated.
Examples can include:
What problem your app solves and why you built it
How you structured conversations with MeDo to build your project
The most impressive feature MeDo helped you create


x link --> 
Publication link --> 

#BuiltWithMeDo

@MeDo_CodeFree

# GeoMaster
Explain how you used MeDo and highlight the best part it generated.
Examples can include:
What problem your app solves and why you built it
How you structured conversations with MeDo to build your project
The most impressive feature MeDo helped you create


x link --> 
Publication link --> 

#BuiltWithMeDo

@MeDo_CodeFree