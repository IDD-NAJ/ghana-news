
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
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
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Kwame Asante",
    timeAgo: "1 hour ago",
    category: "Politics"
  },
  {
    id: "2",
    title: "Black Stars Coach Names Squad for Upcoming AFCON Qualifiers",
    excerpt: "Ghana's national football team coach has announced a 25-man squad featuring both experienced players and promising newcomers for the crucial African Cup of Nations qualifying matches.",
    image: "photo-1461749280684-dccba630e2f6",
    author: "Sports Desk",
    timeAgo: "2 hours ago",
    category: "Sports"
  },
  {
    id: "3",
    title: "Ghana's Digital Economy Surges with New Fintech Innovations",
    excerpt: "Local technology companies are revolutionizing the financial sector with groundbreaking mobile money solutions and digital banking platforms, positioning Ghana as a fintech leader in West Africa.",
    image: "photo-1518770660439-4636190af475",
    author: "Tech Reporter",
    timeAgo: "3 hours ago",
    category: "Technology"
  },
  {
    id: "4",
    title: "Cocoa Farmers Benefit from New Government Support Program",
    excerpt: "The Ministry of Agriculture launches comprehensive support initiative providing subsidized farming equipment and training to boost cocoa production and improve farmer livelihoods.",
    image: "photo-1488590528505-98d2b5aba04b",
    author: "Agricultural Correspondent",
    timeAgo: "4 hours ago",
    category: "Business"
  },
  {
    id: "5",
    title: "Ghanaian Film Industry Gains International Recognition",
    excerpt: "Local filmmakers receive acclaim at international festivals, showcasing Ghana's rich storytelling tradition and cementing the country's position in global cinema.",
    image: "photo-1526374965328-7f61d4dc18c5",
    author: "Entertainment Writer",
    timeAgo: "5 hours ago",
    category: "Entertainment"
  },
  {
    id: "6",
    title: "New University Campus Opens in Tamale",
    excerpt: "The University of Ghana inaugurates a state-of-the-art campus in Tamale, expanding access to higher education in the northern regions and promoting academic excellence.",
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Education Reporter",
    timeAgo: "6 hours ago",
    category: "Education"
  },
  {
    id: "7",
    title: "Traditional Chiefs Meet to Discuss Land Management",
    excerpt: "Traditional authorities from across Ghana convene to address modern challenges in land administration while preserving cultural heritage and customary practices.",
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
    image: "photo-1560472354-b33ff0c44a43",
    author: "Financial Reporter",
    timeAgo: "8 hours ago",
    category: "Business"
  },
  {
    id: "9",
    title: "New Solar Farm Project Launches in Upper East Region",
    excerpt: "Ghana's commitment to renewable energy receives a boost with the launch of a major solar farm project expected to provide clean energy to thousands of homes.",
    image: "photo-1497435334941-8c899ee9e8e9",
    author: "Energy Correspondent",
    timeAgo: "9 hours ago",
    category: "Technology"
  },
  {
    id: "10",
    title: "Asante Kotoko Prepares for CAF Champions League",
    excerpt: "The Porcupine Warriors intensify preparations for their upcoming CAF Champions League campaign with new signings and tactical adjustments.",
    image: "photo-1431324155629-1a6deb1dec8d",
    author: "Football Writer",
    timeAgo: "10 hours ago",
    category: "Sports"
  },
  {
    id: "11",
    title: "Ghana Music Awards Celebrates Local Talent",
    excerpt: "The annual Ghana Music Awards ceremony showcases the best of local musical talent, highlighting the country's vibrant entertainment industry.",
    image: "photo-1493225457124-a3eb161ffa5f",
    author: "Entertainment Critic",
    timeAgo: "11 hours ago",
    category: "Entertainment"
  },
  {
    id: "12",
    title: "National Health Insurance Scheme Expands Coverage",
    excerpt: "The government announces expanded coverage under the National Health Insurance Scheme, including new treatments and services for beneficiaries.",
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
