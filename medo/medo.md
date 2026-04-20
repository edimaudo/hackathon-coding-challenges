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



# GeoMaster


## Write Up

Publication link --> https://app-b0wu1izexx4x.appmedo.com

x info --> How good is your geography knowledge @MeDo_CodeFree? Level up by playing geoMaster(https://app-b0wu1izexx4x.appmedo.com) #BuiltWithMeDo
x link --> https://x.com/edimaudo/status/2045140132471218273?s=20

#BuiltWithMeDo

@MeDo_CodeFree


Explain how you used MeDo and highlight the best part it generated.
Examples can include:
What problem your app solves and why you built it
How you structured conversations with MeDo to build your project
The most impressive feature MeDo helped you create

https://app-b0wu1izexx4x.appmedo.com

## What it does
geoMaster is a time-based geography quiz game that tests your knowledge of countries, flags, capitals, and world facts with 4 exciting modes.  The four modes are:
**Country Mode**: Test your ability to match country names with their flags. You will be shown a country name and must select the correct flag from four options.
**Flag Mode**: Identify countries from their flags. A flag will be displayed and you must choose the correct country name from four options.
**Capital Mode**: Match capital cities with their country flags. You will see a capital city name and must select the flag of the country it belongs to.
**Guesser Mode**: Use multiple clues to identify countries. You will be given facts including population, GDP, capital city, and beer consumption to deduce the correct country.
   
## How we built it
It was built using the meDo Platform.  Under the hood it is powered by react, tailwind and typescript.  
In terms of the requirements I first provided the game mechanics and what the four modes would be.  Next I provided data about the different countries.  Lastly, I provided some skeleton code to get the look and feel I wanted.  I also selected the pixel style when prompting.  Updated the requirmenets to change key text, added reset and home buttons.  Added an about section.  Added accessibility checks.

## Accomplishments that we're proud of
- Built a fun geography game using a retro game style
- Has light and dark mode
- Compatible on mobile and desktop
- The game is accessible based on WCAG 2.1 standards

## What's next for geoMaster
- Increase the number of countries
- Add 3 more exciting modes
- Add a gamification and social elements to the game without impacting the game experience

## Prompt
persona: game developer
context: I would like to build a game called geoMaster a geography game that will have different mini games. The key games are: country-flag game. flag-country game, capital-flag game and one that combines different facts about a country in a sentence and asks what the country is.
design: Each game will be time based. Your lowest time will be what is recorded. If you answer a question incorrectly, you get a time penalty of 60 seconds The app should be mobile friendly. In the setting you should be able to toggle between light and dark mode, see high scores for each game.
game design
country-flag game (Country mode)
In the Country mode, the game will show A country Name and give the user 4 flag images as options. The user has to select the correct flag that corresponds to the country name that is show. If the correct flag is selected, it will be highlighted in green. If the incorrect flag is selected it will be highlighted in red. The correct flag will then be highlighted in green. There would be a 2 seconds wait between question when answer is selected. When the 1 seconds is there would be a smooth transition to the next question. The game will have a total of 7 questions for each session.
flag-country game (Flag Mode) - this will have the same design mechanics are country-flag game. the only difference is that it would show a country flag and the options would be country names.
capital-country game (Capital Mode) - this will have the same design mechanics are country-flag game. the only difference is that it would show a capital and the options would be country flag.
capital-flag game and one that combines different facts about a country in a sentence and asks what the country is.
ne that combines different facts about a country in a sentence and asks what the country is (countryGuesser) - This will show information such as gdp, capital, how much beer is consumed, and the user would have to guess the country. For this game use cia world fact book and the numbers file attached.
the games menu, icons should have a polished feel, perform logic checks to ensure the design is visually appealing, follow good game design principles and proper game mechanices. No emojis.

here is some of the code I started with but it should be built using javascript only
import { Devvit, useState, useAsync } from '@devvit/public-api';

// Expanded and verified data based on CIA World Factbook & Global Health/Consumption reports
const COUNTRIES = [
  // North America
  { code: 'ca', name: 'Canada', capital: 'Ottawa', gdp: '$2.38 trillion', pop: '38.9 million', beer: '57 liters' },
  { code: 'us', name: 'United States', capital: 'Washington, D.C.', gdp: '$25.46 trillion', pop: '333.3 million', beer: '73 liters' },
  { code: 'mx', name: 'Mexico', capital: 'Mexico City', gdp: '$1.41 trillion', pop: '126.7 million', beer: '68 liters' },
  
  // South America
  { code: 'br', name: 'Brazil', capital: 'Brasília', gdp: '$1.92 trillion', pop: '214.3 million', beer: '60 liters' },
  { code: 'ar', name: 'Argentina', capital: 'Buenos Aires', gdp: '$632 billion', pop: '45.8 million', beer: '41 liters' },
  { code: 'co', name: 'Colombia', capital: 'Bogotá', gdp: '$343 billion', pop: '51.8 million', beer: '44 liters' },
  { code: 'cl', name: 'Chile', capital: 'Santiago', gdp: '$300 billion', pop: '19.6 million', beer: '45 liters' },
  { code: 'pe', name: 'Peru', capital: 'Lima', gdp: '$242 billion', pop: '34.0 million', beer: '45 liters' },
  { code: 'uy', name: 'Uruguay', capital: 'Montevideo', gdp: '$71 billion', pop: '3.4 million', beer: '30 liters' },

  // Europe
  { code: 'gb', name: 'United Kingdom', capital: 'London', gdp: '$3.07 trillion', pop: '67.0 million', beer: '70 liters' },
  { code: 'fr', name: 'France', capital: 'Paris', gdp: '$2.78 trillion', pop: '67.8 million', beer: '33 liters' },
  { code: 'de', name: 'Germany', capital: 'Berlin', gdp: '$4.07 trillion', pop: '83.2 million', beer: '92 liters' },
  { code: 'it', name: 'Italy', capital: 'Rome', gdp: '$2.01 trillion', pop: '59.1 million', beer: '31 liters' },
  { code: 'es', name: 'Spain', capital: 'Madrid', gdp: '$1.40 trillion', pop: '47.4 million', beer: '50 liters' },
  { code: 'se', name: 'Sweden', capital: 'Stockholm', gdp: '$585 billion', pop: '10.4 million', beer: '50 liters' },
  { code: 'cz', name: 'Czechia', capital: 'Prague', gdp: '$290 billion', pop: '10.5 million', beer: '140 liters' },
  { code: 'ie', name: 'Ireland', capital: 'Dublin', gdp: '$529 billion', pop: '5.0 million', beer: '95 liters' },
  { code: 'be', name: 'Belgium', capital: 'Brussels', gdp: '$578 billion', pop: '11.6 million', beer: '65 liters' },
  { code: 'nl', name: 'Netherlands', capital: 'Amsterdam', gdp: '$991 billion', pop: '17.5 million', beer: '69 liters' },
  { code: 'ch', name: 'Switzerland', capital: 'Bern', gdp: '$807 billion', pop: '8.7 million', beer: '55 liters' },
  { code: 'ru', name: 'Russia', capital: 'Moscow', gdp: '$2.24 trillion', pop: '143.4 million', beer: '58 liters' },
  { code: 'pl', name: 'Poland', capital: 'Warsaw', gdp: '$688 billion', pop: '38.0 million', beer: '97 liters' },
  { code: 'at', name: 'Austria', capital: 'Vienna', gdp: '$471 billion', pop: '9.0 million', beer: '103 liters' },
  { code: 'gr', name: 'Greece', capital: 'Athens', gdp: '$218 billion', pop: '10.4 million', beer: '28 liters' },
  { code: 'pt', name: 'Portugal', capital: 'Lisbon', gdp: '$253 billion', pop: '10.3 million', beer: '51 liters' },
  { code: 'dk', name: 'Denmark', capital: 'Copenhagen', gdp: '$395 billion', pop: '5.9 million', beer: '60 liters' },
  { code: 'fi', name: 'Finland', capital: 'Helsinki', gdp: '$281 billion', pop: '5.5 million', beer: '74 liters' },
  { code: 'no', name: 'Norway', capital: 'Oslo', gdp: '$579 billion', pop: '5.4 million', beer: '55 liters' },
  { code: 'hu', name: 'Hungary', capital: 'Budapest', gdp: '$178 billion', pop: '9.6 million', beer: '73 liters' },
  { code: 'ro', name: 'Romania', capital: 'Bucharest', gdp: '$301 billion', pop: '19.0 million', beer: '78 liters' },

  // Asia
  { code: 'jp', name: 'Japan', capital: 'Tokyo', gdp: '$4.23 trillion', pop: '124.6 million', beer: '38 liters' },
  { code: 'in', name: 'India', capital: 'New Delhi', gdp: '$3.41 trillion', pop: '1.41 billion', beer: '2 liters' },
  { code: 'cn', name: 'China', capital: 'Beijing', gdp: '$17.96 trillion', pop: '1.41 billion', beer: '29 liters' },
  { code: 'kr', name: 'South Korea', capital: 'Seoul', gdp: '$1.67 trillion', pop: '51.7 million', beer: '39 liters' },
  { code: 'id', name: 'Indonesia', capital: 'Jakarta', gdp: '$1.31 trillion', pop: '275.5 million', beer: '1 liter' },
  { code: 'th', name: 'Thailand', capital: 'Bangkok', gdp: '$495 billion', pop: '71.6 million', beer: '27 liters' },
  { code: 'vn', name: 'Vietnam', capital: 'Hanoi', gdp: '$408 billion', pop: '98.1 million', beer: '43 liters' },
  { code: 'ph', name: 'Philippines', capital: 'Manila', gdp: '$404 billion', pop: '115.5 million', beer: '19 liters' },
  { code: 'my', name: 'Malaysia', capital: 'Kuala Lumpur', gdp: '$406 billion', pop: '33.9 million', beer: '11 liters' },
  { code: 'sa', name: 'Saudi Arabia', capital: 'Riyadh', gdp: '$1.10 trillion', pop: '36.4 million', beer: '0 liters' },
  { code: 'tr', name: 'Turkey', capital: 'Ankara', gdp: '$905 billion', pop: '85.3 million', beer: '13 liters' },
  { code: 'il', name: 'Israel', capital: 'Jerusalem', gdp: '$522 billion', pop: '9.3 million', beer: '14 liters' },
  { code: 'pk', name: 'Pakistan', capital: 'Islamabad', gdp: '$348 billion', pop: '235.8 million', beer: '0.1 liters' },
  { code: 'sg', name: 'Singapore', capital: 'Singapore', gdp: '$466 billion', pop: '5.6 million', beer: '20 liters' },

  // Africa
  { code: 'za', name: 'South Africa', capital: 'Pretoria', gdp: '$405 billion', pop: '59.3 million', beer: '60 liters' },
  { code: 'ng', name: 'Nigeria', capital: 'Abuja', gdp: '$477 billion', pop: '213.4 million', beer: '12 liters' },
  { code: 'eg', name: 'Egypt', capital: 'Cairo', gdp: '$476 billion', pop: '109.3 million', beer: '0.2 liters' },
  { code: 'ke', name: 'Kenya', capital: 'Nairobi', gdp: '$113 billion', pop: '54.0 million', beer: '12 liters' },
  { code: 'et', name: 'Ethiopia', capital: 'Addis Ababa', gdp: '$126 billion', pop: '123.3 million', beer: '4 liters' },
  { code: 'ma', name: 'Morocco', capital: 'Rabat', gdp: '$134 billion', pop: '37.4 million', beer: '1 liter' },
  { code: 'dz', name: 'Algeria', capital: 'Algiers', gdp: '$191 billion', pop: '44.9 million', beer: '1 liter' },
  { code: 'gh', name: 'Ghana', capital: 'Accra', gdp: '$72 billion', pop: '33.4 million', beer: '10 liters' },
  { code: 'tz', name: 'Tanzania', capital: 'Dodoma', gdp: '$75 billion', pop: '65.4 million', beer: '8 liters' },

  // Oceania
  { code: 'au', name: 'Australia', capital: 'Canberra', gdp: '$1.69 trillion', pop: '25.7 million', beer: '71 liters' },
  { code: 'nz', name: 'New Zealand', capital: 'Wellington', gdp: '$248 billion', pop: '5.1 million', beer: '61 liters' },
  { code: 'fj', name: 'Fiji', capital: 'Suva', gdp: '$5 billion', pop: '0.9 million', beer: '30 liters' }
];

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'GeoMaster Quiz',
  render: (context) => {
    const { redis, userId } = context;

    // Game State
    const [page, setPage] = useState('menu'); 
    const [mode, setMode] = useState<string>('country');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [penalty, setPenalty] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);

    // Helpers
    const getFlagUrl = (code: string) => `https://flagcdn.com/w320/${code}.png`;

    // Fetch Best Times for ALL modes
    const { data: bestTimes, loading: loadingBest, refetch: refetchBest } = useAsync(async () => {
      if (!userId) return { country: null, flag: null, capital: null, guesser: null };
      const [country, flag, capital, guesser] = await Promise.all([
        redis.get(`best_time_country_${userId}`),
        redis.get(`best_time_flag_${userId}`),
        redis.get(`best_time_capital_${userId}`),
        redis.get(`best_time_guesser_${userId}`)
      ]);
      return {
        country: country ? parseFloat(country) : null,
        flag: flag ? parseFloat(flag) : null,
        capital: capital ? parseFloat(capital) : null,
        guesser: guesser ? parseFloat(guesser) : null,
      };
    });

    const setupQuestion = (questionList: any[], index: number) => {
        const correct = questionList[index];
        const wrongs = COUNTRIES.filter((c) => c.code !== correct.code)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const shuffledOptions = [...wrongs, correct].sort(() => 0.5 - Math.random());
        setOptions(shuffledOptions);
    };

    const startGame = (selectedMode: string) => {
      const shuffled = [...COUNTRIES].sort(() => 0.5 - Math.random()).slice(0, 7); // 7 Questions
      setQuestions(shuffled);
      setMode(selectedMode);
      setStartTime(Date.now());
      setPenalty(0);
      setCurrentQuestion(0);
      setIsNewRecord(false);
      setPage('playing');
      setFeedback(null);
      
      const correct = shuffled[0];
      const wrongs = COUNTRIES.filter((c) => c.code !== correct.code)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      setOptions([...wrongs, correct].sort(() => 0.5 - Math.random()));
    };

    const handleAnswer = async (answerCode: string) => {
      const correct = questions[currentQuestion];
      let currentPenalty = penalty;

      if (answerCode === correct.code) {
        setFeedback('Correct!');
      } else {
        setFeedback('Wrong! +60s Penalty');
        currentPenalty += 60000; // Increased to 60 seconds as per original request requirements
        setPenalty(currentPenalty);
      }

      setTimeout(async () => {
        if (currentQuestion < questions.length - 1) {
          const nextQ = currentQuestion + 1;
          setCurrentQuestion(nextQ);
          setupQuestion(questions, nextQ);
          setFeedback(null);
        } else {
          // Game Over
          const finalTimeMs = Date.now() - startTime + currentPenalty;
          const finalTimeSec = finalTimeMs / 1000;
          setScore(finalTimeMs);
          
          if (userId) {
            const currentBestStr = await redis.get(`best_time_${mode}_${userId}`);
            const currentBest = currentBestStr ? parseFloat(currentBestStr) : null;
            
            if (currentBest === null || finalTimeSec < currentBest) {
              await redis.set(`best_time_${mode}_${userId}`, finalTimeSec.toString());
              setIsNewRecord(true);
              refetchBest(); // Update menu scores for next time
            }
          }
          setPage('results');
        }
      }, 1500);
    };

    const clearScores = async () => {
      if (userId) {
        await Promise.all([
            redis.del(`best_time_country_${userId}`),
            redis.del(`best_time_flag_${userId}`),
            redis.del(`best_time_capital_${userId}`),
            redis.del(`best_time_guesser_${userId}`)
        ]);
        refetchBest();
        setPage('menu');
      }
    };

    // --- Views ---

    const Menu = (
      <vstack alignment="middle center" gap="medium" padding="large" height="100%">
        <text size="xxlarge" weight="bold">GeoMaster</text>
        <text size="medium" color="secondary">Select Game Mode</text>
        
        <vstack gap="small" width="100%" maxWidth="300px">
            <button icon="world" appearance="secondary" onPress={() => startGame('country')}>Country Mode</button>
            <button icon="image" appearance="secondary" onPress={() => startGame('flag')}>Flag Mode</button>
            <button icon="location" appearance="secondary" onPress={() => startGame('capital')}>Capital Mode</button>
            <button icon="search" appearance="secondary" onPress={() => startGame('guesser')}>Guesser Mode</button>
        </vstack>

        <vstack backgroundColor="neutral-background-weak" padding="medium" cornerRadius="medium" width="100%" maxWidth="300px">
            <text size="small" weight="bold" color="secondary">PERSONAL BESTS</text>
            <hstack alignment="middle space-between">
                <text size="small">Country:</text>
                <text size="small" weight="bold">{bestTimes?.country ? `${bestTimes.country.toFixed(2)}s` : '--'}</text>
            </hstack>
            <hstack alignment="middle space-between">
                <text size="small">Flag:</text>
                <text size="small" weight="bold">{bestTimes?.flag ? `${bestTimes.flag.toFixed(2)}s` : '--'}</text>
            </hstack>
            <hstack alignment="middle space-between">
                <text size="small">Capital:</text>
                <text size="small" weight="bold">{bestTimes?.capital ? `${bestTimes.capital.toFixed(2)}s` : '--'}</text>
            </hstack>
            <hstack alignment="middle space-between">
                <text size="small">Guesser:</text>
                <text size="small" weight="bold">{bestTimes?.guesser ? `${bestTimes.guesser.toFixed(2)}s` : '--'}</text>
            </hstack>
        </vstack>

        <button icon="settings" appearance="ghost" onPress={() => setPage('settings')}>
          Settings
        </button>
      </vstack>
    );

    const Settings = (
        <vstack alignment="middle center" gap="medium" padding="large" height="100%">
            <text size="large" weight="bold">Settings</text>
            <vstack gap="small" alignment="middle center">
                <text size="small" color="secondary">Erase all your personal best times?</text>
                <button appearance="destructive" onPress={clearScores}>Clear All Scores</button>
            </vstack>
            <button appearance="secondary" onPress={() => setPage('menu')}>Back</button>
        </vstack>
    );

    const Playing = () => {
      const country = questions[currentQuestion];
      if (!country) return <text>Loading...</text>;

      let QuestionHeader;
      let OptionGrid;

      // MODE: Country (Name -> Flags)
      if (mode === 'country') {
        QuestionHeader = (
            <vstack alignment="center middle" gap="small">
                <text size="large" weight="bold">{country.name}</text>
                <text size="small">Select the correct flag</text>
            </vstack>
        );
        OptionGrid = (
            <vstack gap="small" width="100%">
                <hstack gap="small" width="100%">
                    <image url={getFlagUrl(options[0].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[0].code)} />
                    <image url={getFlagUrl(options[1].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[1].code)} />
                </hstack>
                <hstack gap="small" width="100%">
                    <image url={getFlagUrl(options[2].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[2].code)} />
                    <image url={getFlagUrl(options[3].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[3].code)} />
                </hstack>
            </vstack>
        );
      }
      // MODE: Flag (Flag -> Names)
      else if (mode === 'flag') {
        QuestionHeader = (
            <vstack alignment="center middle" gap="small">
                <image url={getFlagUrl(country.code)} imageWidth={200} imageHeight={133} resizeMode='cover' />
                <text size="small">Which country is this?</text>
            </vstack>
        );
        OptionGrid = (
            <vstack gap="small" width="100%">
                {options.map((opt) => (
                    <button onPress={() => handleAnswer(opt.code)} appearance="secondary" width="100%">{opt.name}</button>
                ))}
            </vstack>
        );
      }
      // MODE: Capital (Capital -> Flags)
      else if (mode === 'capital') {
        QuestionHeader = (
            <vstack alignment="center middle" gap="small">
                <text size="large" weight="bold">{country.capital}</text>
                <text size="small">Select the country for this capital</text>
            </vstack>
        );
        OptionGrid = (
            <vstack gap="small" width="100%">
                <hstack gap="small" width="100%">
                    <image url={getFlagUrl(options[0].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[0].code)} />
                    <image url={getFlagUrl(options[1].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[1].code)} />
                </hstack>
                <hstack gap="small" width="100%">
                    <image url={getFlagUrl(options[2].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[2].code)} />
                    <image url={getFlagUrl(options[3].code)} imageWidth={140} imageHeight={93} resizeMode='cover' onPress={() => handleAnswer(options[3].code)} />
                </hstack>
            </vstack>
        );
      }
      // MODE: Guesser (Facts -> Names)
      else {
        QuestionHeader = (
            <vstack backgroundColor="neutral-background-weak" padding="medium" cornerRadius="medium" gap="small" border="thin">
                <text size="medium" weight="bold">Mystery Country Profile</text>
                <text wrap>This nation is home to a population of approximately {country.pop}.</text>
                <text wrap>Its economy is significant, with a GDP reaching {country.gdp}.</text>
                <text wrap>The political heart of the country is located in its capital, {country.capital}.</text>
                <text wrap>On average, citizens consume about {country.beer} of beer annually.</text>
            </vstack>
        );
        OptionGrid = (
            <vstack gap="small" width="100%">
                {options.map((opt) => (
                    <button onPress={() => handleAnswer(opt.code)} appearance="secondary" width="100%">{opt.name}</button>
                ))}
            </vstack>
        );
      }

      return (
        <vstack gap="medium" padding="medium" alignment="top center" height="100%">
          <hstack width="100%" alignment="middle space-between">
            <text size="small" weight="bold">Question {currentQuestion + 1}/7</text>
            <text size="small" color="danger">Penalty: {penalty / 1000}s</text>
          </hstack>

          {QuestionHeader}

          <zstack height="24px" alignment="middle center">
            {feedback && (
                <text weight="bold" color={feedback.startsWith('Correct') ? 'success' : 'danger'}>
                {feedback}
                </text>
            )}
          </zstack>

          {OptionGrid}
        </vstack>
      );
    };

    const Results = (
      <vstack alignment="middle center" gap="medium" padding="large" height="100%">
        <text size="xlarge" weight="bold">Finished!</text>
        <vstack alignment="middle center">
            <text size="large">Final Time: {(score / 1000).toFixed(2)}s</text>
            {isNewRecord && (
                <hstack gap="small" alignment="middle center">
                    <icon name="star-fill" color="warning" size="small" />
                    <text color="warning" weight="bold">New Personal Best!</text>
                </hstack>
            )}
        </vstack>
        <button icon="refresh" onPress={() => setPage('menu')}>Back to Menu</button>
      </vstack>
    );

    return (
      <zstack width="100%" height="100%" alignment="middle center">
        {page === 'menu' && Menu}
        {page === 'settings' && Settings}
        {page === 'playing' && Playing()}
        {page === 'results' && Results}
      </zstack>
    );
  },
});

export default Devvit;

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
lets add data storage for the bias and quiz information.  Let's also add clean transition effects.  Lets also add some daily bias reminders but with the ability to change when the notification shows up.

## Write up

Explain how you used MeDo and highlight the best part it generated.
Examples can include:
What problem your app solves and why you built it
How you structured conversations with MeDo to build your project
The most impressive feature MeDo helped you create

## Inspiration
Are you upset you are making poor decisions? Want to sharpen your cognitive skills? This is where Unbiased comes in.  It is a simple tool to help you sharpen your thinking skills by helping you tackle cognitive biases.

## What it does
At its core Unbiased is a responsive web app called Unbiased that helps users sharpen the way they think.  It gives the users the ability to explore different biases and play games that can help the user better understand biases. 

## How we built it
It was built using the medo.dev platform.  Under the hood it is powered by react, tailwind, typescript and cognitive bias content.  

### Underlying design
- It should have a responsive design
- font would be inter or century schoolhouse with fonts of different sizes (small, medium and large)
- color scheme would be navy blue themed
- It should be accessible. It should have the ability to change font sizes and have a dark and light mode.  The user should be able to change the mode but it should default to dark mode
- Should be able to get to every section using a hamburger menu
- It should have localization with ability to change languages.  The key languages would be English, French and Spanish

### Views
**Home View**
It would show bias of the day, Bias Explorer, Bias Detector and Settings.

**Bias Explorer View**
It should show a list of biases with their name and a high level overview in a card format.  When clicked into It shows the bias name, details about the bias, Where this bias occurs, WHy it happens, WHy it matters, 3 examples of it, How it affects you, how it affects a business, How to avoid it. 

**Bias Detector View**
This is a quiz section where the user would be tested on their knowledge of biases.  There would be two types of quizzes, name that bias and bias checker.  For name that bias, the user would be posed with a challenge about a type of bias and would have to select the type of bias.   
For the bias checker game the user would be posed question in order to check their understanding of biases.  Each question would be a scenario and the user would be given 3 options and would have to check.

**Settings**
This would give the ability the change the design settings for the app

## Challenges we ran into
The main challenge I ran into was when I first tried building the app, the medo.dev platform stalled and it could not build the app.  I then decided to delete that version and rebuild it from scratch.  It then worked on the second attempt.  Another issue that cropped up was tackling translations.  When medo.dev built the app, the translation from English to French and English to Spanish was not working seamlessly.  I wrote 2 prompts to make updates to the Bias Explorer section to ensure it worked as expected.


## What we learned
It was a great experience learning about different biases that we as humans are exposed too.  It made me more cognizant of them.

## What's next for Unbiased
- Increase the number of biases that are available
- Increase language support
- Add social and gamification elements to Bias Detector section

Publication link --> https://app-b2nnykhvf30h.appmedo.com
x post --> @MeDo_CodeFree Sharpen your thinking by using Unbiased (https://app-b2nnykhvf30h.appmedo.com) a tool to tackle cognitive biases #BuiltWithMeDo
x link --> https://x.com/edimaudo/status/2045929048363110698?s=20


#BuiltWithMeDo


## PennyWize

### Prompt
persona: experienced web developer with financial knowledge and insights
context: I would like to build a financial learning platform focused on United States and Canada.
Requirements:
- It should have a responsive web design
- font would be Helvetica or inter or century schoolhouse
- color scheme (--primary-blue: #3e688c;
    --success-green: #03a63c;
    --secondary-green: #5ba66e;
    --accent-teal: #69bfbf;
    --white: #ffffff;
    --light-gray: #f8f9fa;
    --medium-gray: #e0e0e0;
    --dark-gray: #666666;
    --text-dark: #333333;
    --error-red: #dc3545;)
- It should be accessible following WCAG 2.1 guidelines
- It should have the ability to change font sizes.  When changed it should change all aspects of the app
- It should have a dark and light mode.  The user should be able to change the mode but it should default to dark mode.  When it changes it should apply to all aspects of the app
- It should have localization with ability to change languages.  The key languages would be English, French and Spanish.  When there is a language change it should change all content to the new language
- It should have one other content toggle (Content which would either be United States or Canada).  When changed it should change all aspects of the app


Views
Landing Page

Financial Literacy Assessment

Quiz

Glossary

Settings
This would house be the area where the user can adjust the settings
Settings include:
- font size
- dark or light mode
- localization language
- content

When the user selects United States content use content from https://github.com/edimaudo/dollarWize and populate the views
When the user selects Canada content use content from https://github.com/edimaudo/finWise and populate the views




### Write Up

Publication link --> 

x info --> How good is your geography knowledge @MeDo_CodeFree? Level up by playing geoMaster(https://app-b0wu1izexx4x.appmedo.com) #BuiltWithMeDo
x link --> 

#BuiltWithMeDo

@MeDo_CodeFree


## Inspiration
Financial literacy in the US and Canada shows high awareness but low practical application, with significant gaps in understanding debt, investment, and inflation. I wanted to build an app that helps people close this gap.  

## What it does
It helps Canadians and American build core financial skills, all while maintaining engagement through personalization. It has a quiz assessment to check your financial literacy, Also have a quiz based on your financial literacy level to help you learn. If you want to learn more about different financial and economic terms you can check out the glossary.

## How we built it


It was built using the medo.dev platform.  Under the hood it is powered by react, tailwind, typescript and cognitive bias content.  

### Underlying design
- It should have a responsive design
- font would be inter or century schoolhouse with fonts of different sizes (small, medium and large)
- color scheme would be navy blue themed
- It should be accessible. It should have the ability to change font sizes and have a dark and light mode.  The user should be able to change the mode but it should default to dark mode
- Should be able to get to every section using a hamburger menu
- It should have localization with ability to change languages.  The key languages would be English, French and Spanish

### Views
**Home View**
It would show bias of the day, Bias Explorer, Bias Detector and Settings.

**Bias Explorer View**
It should show a list of biases with their name and a high level overview in a card format.  When clicked into It shows the bias name, details about the bias, Where this bias occurs, WHy it happens, WHy it matters, 3 examples of it, How it affects you, how it affects a business, How to avoid it. 

**Bias Detector View**
This is a quiz section where the user would be tested on their knowledge of biases.  There would be two types of quizzes, name that bias and bias checker.  For name that bias, the user would be posed with a challenge about a type of bias and would have to select the type of bias.   
For the bias checker game the user would be posed question in order to check their understanding of biases.  Each question would be a scenario and the user would be given 3 options and would have to check.

**Settings**
This would give the ability the change the design settings for the app

## Challenges we ran into
The main challenge was getting the financial content.  There was so much information out there so had to narrow it down.




## What's next for PennyWize

- Increase the amount of financial content and personalization
- add tools that users can leverage to drive better financial decision making --> expense tracker, credit card comparison tool
- Leverge Large language models to be able to provide scenarios and different ways to explain financial topics







