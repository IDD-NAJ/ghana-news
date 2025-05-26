
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  timeAgo: string;
  category: string;
}

export const allNews: NewsItem[] = [
  // Featured and main news from Index
  {
    id: "1",
    title: "President Akufo-Addo Announces Major Infrastructure Development Plan for Northern Ghana",
    excerpt: "In a landmark announcement, the President outlined ambitious plans to transform the northern regions with new roads, hospitals, and educational facilities, marking a significant investment in the area's development.",
    content: "In a landmark announcement that marks a significant milestone for Ghana's development agenda, President Akufo-Addo has unveiled an ambitious infrastructure development plan specifically targeting the northern regions of the country. This comprehensive initiative represents one of the largest single investments in northern Ghana's modern history, with implications that extend far beyond immediate infrastructure improvements. The President's announcement, made during a state address, outlined detailed plans for the construction of new roads, hospitals, and educational facilities that will fundamentally transform the landscape of opportunity in these regions. The infrastructure development plan encompasses multiple sectors, with particular emphasis on improving transportation networks that have long been identified as barriers to economic growth in the northern territories. New road construction projects will connect previously isolated communities to major economic centers, facilitating trade and commerce while providing residents with improved access to essential services. Healthcare infrastructure forms another cornerstone of this development initiative, with plans for state-of-the-art hospitals and clinics designed to address the significant healthcare disparities that have historically affected northern Ghana. Educational facilities, including schools and technical training centers, will provide enhanced learning opportunities and help develop the skilled workforce necessary for sustained economic growth in the region.",
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Kwame Asante",
    timeAgo: "1 hour ago",
    category: "Politics"
  },
  {
    id: "2",
    title: "Black Stars Coach Names Squad for Upcoming AFCON Qualifiers",
    excerpt: "Ghana's national football team coach has announced a 25-man squad featuring both experienced players and promising newcomers for the crucial African Cup of Nations qualifying matches.",
    content: "Ghana's national football team coach has made a strategic announcement regarding the composition of the 25-man squad selected for the upcoming African Cup of Nations qualifying matches. This carefully curated selection represents a balanced approach that combines the wisdom and experience of veteran players with the fresh energy and potential of promising newcomers to the national team setup. The announcement comes at a crucial juncture for Ghanaian football, as the Black Stars seek to secure their place in the prestigious continental tournament. The squad selection reflects months of careful observation and analysis of player performances both domestically and internationally. Veteran players bring invaluable experience from previous international competitions, while the inclusion of newcomers signals the coach's commitment to building for the future. This blend of experience and youth is designed to create a dynamic team capable of adapting to various tactical situations and maintaining competitive intensity throughout the demanding qualification campaign. The qualifying matches represent more than just football contests; they embody the hopes and aspirations of millions of Ghanaian football fans who have supported the Black Stars through various campaigns over the years.",
    image: "photo-1461749280684-dccba630e2f6",
    author: "Sports Desk",
    timeAgo: "2 hours ago",
    category: "Sports"
  },
  {
    id: "3",
    title: "Ghana's Digital Economy Surges with New Fintech Innovations",
    excerpt: "Local technology companies are revolutionizing the financial sector with groundbreaking mobile money solutions and digital banking platforms, positioning Ghana as a fintech leader in West Africa.",
    content: "Ghana's digital economy is experiencing unprecedented growth as local technology companies spearhead revolutionary changes in the financial sector through groundbreaking mobile money solutions and innovative digital banking platforms. This technological transformation is positioning Ghana as an emerging fintech leader not only within West Africa but across the broader African continent. The surge in fintech innovations represents a fundamental shift in how Ghanaians interact with financial services, moving from traditional banking models to more accessible, efficient, and user-friendly digital alternatives. Local technology companies have developed sophisticated mobile money solutions that address the unique needs of the Ghanaian market, taking into account factors such as internet connectivity, smartphone penetration, and traditional banking accessibility challenges. These digital banking platforms offer features that were previously unavailable to many Ghanaians, including instant money transfers, digital savings accounts, micro-lending services, and comprehensive financial management tools. The impact of these innovations extends far beyond urban centers, reaching rural communities that have historically been underserved by traditional banking infrastructure. This democratization of financial services is creating new opportunities for economic participation and growth across all segments of Ghanaian society.",
    image: "photo-1518770660439-4636190af475",
    author: "Tech Reporter",
    timeAgo: "3 hours ago",
    category: "Technology"
  },
  {
    id: "4",
    title: "Cocoa Farmers Benefit from New Government Support Program",
    excerpt: "The Ministry of Agriculture launches comprehensive support initiative providing subsidized farming equipment and training to boost cocoa production and improve farmer livelihoods.",
    content: "The Ministry of Agriculture has launched a comprehensive support initiative designed to provide significant benefits to cocoa farmers across Ghana through subsidized farming equipment and specialized training programs. This government-backed program represents a strategic investment in one of Ghana's most important agricultural sectors, with the dual objectives of boosting cocoa production and improving the livelihoods of farming communities that form the backbone of the nation's cocoa industry. The support program addresses longstanding challenges faced by cocoa farmers, including access to modern farming equipment, technical knowledge, and financial resources necessary for optimal crop production. Through carefully structured subsidies, farmers can now access high-quality farming tools and machinery that were previously beyond their financial reach. The training component of the program focuses on modern agricultural techniques, sustainable farming practices, and crop management strategies that can significantly improve yield quality and quantity. This comprehensive approach recognizes that successful agricultural development requires both technological resources and knowledge transfer to ensure farmers can effectively utilize new tools and techniques. The program's impact extends beyond individual farmers to encompass entire farming communities, creating a ripple effect that strengthens the overall cocoa production ecosystem in Ghana.",
    image: "photo-1488590528505-98d2b5aba04b",
    author: "Agricultural Correspondent",
    timeAgo: "4 hours ago",
    category: "Business"
  },
  {
    id: "5",
    title: "Ghanaian Film Industry Gains International Recognition",
    excerpt: "Local filmmakers receive acclaim at international festivals, showcasing Ghana's rich storytelling tradition and cementing the country's position in global cinema.",
    content: "The Ghanaian film industry has achieved remarkable international recognition as local filmmakers receive widespread acclaim at prestigious international festivals around the world. This recognition represents a significant milestone for Ghana's creative industry and serves to showcase the country's rich storytelling tradition while cementing its emerging position in global cinema. The international acclaim reflects years of dedicated work by Ghanaian filmmakers who have consistently pushed creative boundaries while staying true to authentic African narratives and cultural expressions. These festival recognitions are not merely awards; they represent validation of Ghana's unique cinematic voice and its contribution to global film culture. The success of Ghanaian films at international venues opens new doors for collaboration, distribution, and investment in the local film industry. International recognition brings with it opportunities for co-productions, international funding, and access to global markets that can significantly expand the reach and impact of Ghanaian cinema. The films that have garnered international attention often explore themes that resonate universally while maintaining distinctly Ghanaian perspectives, creating a bridge between local culture and global audiences. This achievement positions Ghana as an important player in the African film renaissance and contributes to the broader movement of African cinema gaining recognition on the world stage.",
    image: "photo-1526374965328-7f61d4dc18c5",
    author: "Entertainment Writer",
    timeAgo: "5 hours ago",
    category: "Entertainment"
  },
  {
    id: "6",
    title: "New University Campus Opens in Tamale",
    excerpt: "The University of Ghana inaugurates a state-of-the-art campus in Tamale, expanding access to higher education in the northern regions and promoting academic excellence.",
    content: "The University of Ghana has inaugurated a state-of-the-art campus in Tamale, marking a historic moment in the expansion of higher education access throughout Ghana's northern regions. This new campus represents a significant investment in academic infrastructure and demonstrates the university's commitment to promoting educational excellence across all regions of the country. The Tamale campus features modern facilities designed to support cutting-edge research and innovative teaching methodologies, providing students in the northern regions with access to world-class educational resources without the need to relocate to southern Ghana. The campus includes specialized laboratories, modern lecture halls, comprehensive library facilities, and residential accommodations that create a conducive environment for academic pursuit and intellectual development. This expansion addresses historical educational disparities and provides opportunities for students from northern Ghana and neighboring countries to access quality higher education. The new campus will offer diverse academic programs spanning multiple disciplines, from agriculture and engineering to business and liberal arts, ensuring that students have access to comprehensive educational opportunities that align with both regional needs and global standards.",
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Education Reporter",
    timeAgo: "6 hours ago",
    category: "Education"
  },
  {
    id: "7",
    title: "Traditional Chiefs Meet to Discuss Land Management",
    excerpt: "Traditional authorities from across Ghana convene to address modern challenges in land administration while preserving cultural heritage and customary practices.",
    content: "Traditional authorities from across Ghana have convened for an important meeting focused on addressing the complex intersection of modern land administration challenges and the preservation of cultural heritage and customary practices. This gathering represents a crucial dialogue between traditional governance systems and contemporary administrative needs, highlighting the ongoing relevance of traditional authority in modern Ghana. The chiefs' deliberations encompass various aspects of land management, including dispute resolution, sustainable land use practices, and the integration of traditional knowledge with modern administrative systems. These discussions are particularly significant given the increasing pressure on land resources due to population growth, urbanization, and economic development. The traditional authorities bring centuries of collective wisdom regarding land stewardship and community management, offering valuable perspectives on sustainable development practices that respect both environmental conservation and cultural values. The meeting addresses the need to balance economic development with cultural preservation, ensuring that land management practices support community needs while maintaining the integrity of traditional governance systems.",
    image: "photo-1488590528505-98d2b5aba04b",
    author: "Cultural Affairs",
    timeAgo: "7 hours ago",
    category: "Culture"
  },
  // Additional stories for pagination
  {
    id: "8",
    title: "Ghana Stock Exchange Records Strong Performance",
    excerpt: "The Ghana Stock Exchange closes the week with significant gains, driven by strong performance in banking and telecommunications sectors.",
    content: "The Ghana Stock Exchange has demonstrated remarkable resilience and growth potential by closing the week with significant gains across multiple sectors, particularly driven by outstanding performance in banking and telecommunications industries. This positive market movement reflects increased investor confidence in Ghana's economic fundamentals and the growing attractiveness of Ghanaian equities to both domestic and international investors. The banking sector's strong performance can be attributed to several factors, including improved regulatory frameworks, enhanced digital banking services, and increased lending activities that support economic growth. Telecommunications companies have also contributed significantly to market gains, benefiting from expanding mobile network coverage, increased data consumption, and innovative service offerings that cater to Ghana's growing digital economy. The stock exchange's performance serves as an important barometer of economic health and investor sentiment, providing insights into market confidence and future economic prospects. These gains reflect broader economic trends and suggest positive momentum in key sectors that are fundamental to Ghana's economic development strategy.",
    image: "photo-1560472354-b33ff0c44a43",
    author: "Financial Reporter",
    timeAgo: "8 hours ago",
    category: "Business"
  },
  {
    id: "9",
    title: "New Solar Farm Project Launches in Upper East Region",
    excerpt: "Ghana's commitment to renewable energy receives a boost with the launch of a major solar farm project expected to provide clean energy to thousands of homes.",
    content: "Ghana's commitment to renewable energy development has received a significant boost with the official launch of a major solar farm project in the Upper East Region, an initiative that promises to provide clean, sustainable energy to thousands of homes across the area. This solar farm represents a crucial step forward in Ghana's renewable energy strategy and demonstrates the country's dedication to addressing climate change while meeting growing energy demands through environmentally responsible means. The project utilizes cutting-edge solar technology designed to maximize energy generation efficiency while minimizing environmental impact, incorporating advanced photovoltaic systems that can adapt to local weather conditions and optimize power generation throughout the day. The solar farm's location in the Upper East Region was strategically chosen to take advantage of the area's abundant sunshine and open land availability, while also providing economic opportunities for local communities through job creation and skills development programs. This renewable energy initiative aligns with Ghana's broader sustainable development goals and contributes to international efforts to reduce carbon emissions and combat climate change. The project is expected to significantly reduce reliance on fossil fuels in the region while providing reliable, affordable electricity to both residential and commercial users.",
    image: "photo-1497435334941-8c899ee9e8e9",
    author: "Energy Correspondent",
    timeAgo: "9 hours ago",
    category: "Technology"
  },
  {
    id: "10",
    title: "Asante Kotoko Prepares for CAF Champions League",
    excerpt: "The Porcupine Warriors intensify preparations for their upcoming CAF Champions League campaign with new signings and tactical adjustments.",
    content: "Asante Kotoko, Ghana's most successful football club known as the Porcupine Warriors, has intensified preparations for their upcoming CAF Champions League campaign through strategic new signings and comprehensive tactical adjustments designed to enhance their competitive prospects in Africa's premier club competition. The club's preparation strategy reflects a thorough understanding of the challenges and opportunities presented by continental competition, where success requires not only skill and determination but also tactical sophistication and squad depth. The new signings represent carefully targeted acquisitions aimed at addressing specific tactical needs and strengthening positions identified as crucial for Champions League success. These additions bring fresh energy and different skill sets that complement the existing squad while providing the coach with greater tactical flexibility during matches. The tactical adjustments being implemented focus on developing playing systems that can adapt to different opponents and match situations, recognizing that Champions League success often depends on tactical versatility and strategic adaptability. Training sessions have been intensified to ensure players reach peak physical condition while developing the mental resilience necessary for high-pressure continental matches.",
    image: "photo-1431324155629-1a6deb1dec8d",
    author: "Football Writer",
    timeAgo: "10 hours ago",
    category: "Sports"
  },
  {
    id: "11",
    title: "Ghana Music Awards Celebrates Local Talent",
    excerpt: "The annual Ghana Music Awards ceremony showcases the best of local musical talent, highlighting the country's vibrant entertainment industry.",
    content: "The annual Ghana Music Awards ceremony has successfully showcased the extraordinary breadth and depth of local musical talent, providing a prestigious platform that highlights Ghana's vibrant and diverse entertainment industry. This celebration of musical excellence represents much more than an awards ceremony; it serves as a comprehensive showcase of Ghana's rich musical heritage and its continued evolution in the contemporary global music landscape. The awards ceremony featured performances and recognition across multiple musical genres, from traditional highlife and gospel to contemporary afrobeats and hip-hop, demonstrating the remarkable diversity and creativity that characterizes Ghanaian music. The event celebrated both established artists who have contributed significantly to Ghana's musical legacy and emerging talents who represent the future of the industry. The recognition provided by these awards plays a crucial role in promoting Ghanaian music both domestically and internationally, helping to elevate the profile of local artists and attract global attention to Ghana's music scene. The ceremony also served as an important networking opportunity for industry professionals, fostering collaborations and partnerships that can drive further growth and development in Ghana's entertainment sector.",
    image: "photo-1493225457124-a3eb161ffa5f",
    author: "Entertainment Critic",
    timeAgo: "11 hours ago",
    category: "Entertainment"
  },
  {
    id: "12",
    title: "National Health Insurance Scheme Expands Coverage",
    excerpt: "The government announces expanded coverage under the National Health Insurance Scheme, including new treatments and services for beneficiaries.",
    content: "The Ghanaian government has announced a significant expansion of coverage under the National Health Insurance Scheme (NHIS), introducing new treatments and services that will substantially benefit current and future beneficiaries across the country. This expansion represents a major step forward in Ghana's commitment to providing accessible, affordable healthcare to all citizens, regardless of their economic status or geographic location. The enhanced coverage includes previously excluded medical treatments, specialized procedures, and preventive care services that were not available under the original scheme framework. These additions address gaps in healthcare coverage that have been identified through years of scheme operation and beneficiary feedback, ensuring that the NHIS continues to evolve to meet the changing healthcare needs of the Ghanaian population. The expansion encompasses both primary healthcare services and specialized treatments, including mental health services, advanced diagnostic procedures, and certain surgical interventions that were previously available only through private healthcare providers. This comprehensive approach to healthcare coverage reflects the government's recognition that effective health insurance must address the full spectrum of medical needs, from routine preventive care to complex medical conditions requiring specialized intervention.",
    image: "photo-1559757148-5c350d0d3c56",
    author: "Health Reporter",
    timeAgo: "12 hours ago",
    category: "Politics"
  }
];

export const getNewsByCategory = (category: string): NewsItem[] => {
  return allNews.filter(news => news.category === category);
};

export const getFeaturedNews = (): NewsItem => {
  return allNews[0];
};

export const getMainNews = (): NewsItem[] => {
  return allNews.slice(1, 7);
};

export const getNewsById = (id: string): NewsItem | undefined => {
  return allNews.find(news => news.id === id);
};
