import { useState, useEffect } from 'react';
import { Clock, Heart, MessageCircle, Share2, Repeat, BookmarkPlus, ThumbsDown, Eye, Forward, AlertTriangle } from 'lucide-react';

// App component - the main container
export default function TikTokAlgorithmDemo() {
  // Content categories that affect mental health - positives in green, negatives in red
  const contentCategories = [
    // Positive Content Categories (GREEN)
    { 
      id: "funny",
      label: "Funny Content", 
      description: "Humorous skits and jokes",
      mentalHealthImpact: +2,
      engagementLevel: 0.7,
      color: "bg-green-500"
    },
    { 
      id: "educational",
      label: "Educational", 
      description: "Informative educational content",
      mentalHealthImpact: +3,
      engagementLevel: 0.5,
      color: "bg-green-500"
    },
    { 
      id: "selfHelp",
      label: "Self Help", 
      description: "Mental health and self improvement tips",
      mentalHealthImpact: +4,
      engagementLevel: 0.6,
      color: "bg-green-500"
    },
    { 
      id: "creativity",
      label: "Creative Content", 
      description: "Art, music, and DIY projects",
      mentalHealthImpact: +3,
      engagementLevel: 0.65,
      color: "bg-green-500"
    },
    { 
      id: "nature",
      label: "Nature & Outdoors", 
      description: "Beautiful landscapes and outdoor activities",
      mentalHealthImpact: +3,
      engagementLevel: 0.55,
      color: "bg-green-500"
    },
    { 
      id: "mindfulness",
      label: "Mindfulness", 
      description: "Meditation and stress-reduction practices",
      mentalHealthImpact: +4,
      engagementLevel: 0.5,
      color: "bg-green-500"
    },
    
    // Negative Content Categories (RED)
    { 
      id: "perfectBodies",
      label: "Perfect Bodies", 
      description: "Fitness and body transformation content",
      mentalHealthImpact: -4,
      engagementLevel: 0.85,
      color: "bg-red-500"
    },
    { 
      id: "luxury",
      label: "Luxury Lifestyle", 
      description: "Expensive products and luxury lifestyle",
      mentalHealthImpact: -3,
      engagementLevel: 0.8,
      color: "bg-red-500"
    },
    { 
      id: "social",
      label: "Social Validation", 
      description: "Popular groups having fun without you",
      mentalHealthImpact: -3,
      engagementLevel: 0.82,
      color: "bg-red-500"
    },
    { 
      id: "controversy",
      label: "Controversial", 
      description: "Polarizing opinions and heated debates",
      mentalHealthImpact: -2,
      engagementLevel: 0.9,
      color: "bg-red-500"
    },
    { 
      id: "celebrityDrama",
      label: "Celebrity Drama", 
      description: "Celebrity gossip and relationship drama",
      mentalHealthImpact: -2,
      engagementLevel: 0.88,
      color: "bg-red-500"
    },
    { 
      id: "extremeWealth",
      label: "Extreme Wealth", 
      description: "Displays of unattainable luxury and wealth",
      mentalHealthImpact: -3,
      engagementLevel: 0.85,
      color: "bg-red-500"
    },
    { 
      id: "lifeMilestones",
      label: "Life Milestones", 
      description: "People achieving major life goals you haven't",
      mentalHealthImpact: -3,
      engagementLevel: 0.75,
      color: "bg-red-500"
    },
    { 
      id: "extremeBeauty",
      label: "Extreme Beauty", 
      description: "Unrealistic beauty standards and transformations",
      mentalHealthImpact: -4,
      engagementLevel: 0.82,
      color: "bg-red-500"
    }
  ];

  // State for current video being shown
  const [currentVideo, setCurrentVideo] = useState(null);
  
  // Algorithm weights (highly exaggerated for demonstration)
  const [algorithmWeights, setAlgorithmWeights] = useState({
    watchTime: 8,     // Multiplier for watch time impact
    likes: 6,         // Multiplier for likes impact
    comments: 4,      // Multiplier for comments impact
    shares: 7,        // Multiplier for shares impact
    skips: -6         // Multiplier for skips impact
  });
  
  // Category preferences based on interactions (higher = more likely to see)
  const [categoryPreferences, setCategoryPreferences] = useState(
    contentCategories.reduce((acc, category) => {
      acc[category.id] = 1; // Initial neutral preference
      return acc;
    }, {})
  );
  
  // User mental health state
  const [mentalHealth, setMentalHealth] = useState({
    score: 75, // 0-100 scale, higher is better
    history: [] // Track changes over time for visualization
  });
  
  // Interaction counter to show how many videos user has interacted with
  const [interactionCount, setInteractionCount] = useState(0);

  // Queue of upcoming videos
  const [upcomingVideos, setUpcomingVideos] = useState([]);
  
  // Fixed simulation speed
  const simulationSpeed = 3;
  
  // Show algorithm explanation
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);
  
  // User engagement metrics
  const [engagementMetrics, setEngagementMetrics] = useState({
    avgWatchTime: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalSkips: 0
  });

  // Initialize with first video
  useEffect(() => {
    generateNextVideo();
  }, []);
  
  // Update mental health history for graph
  useEffect(() => {
    if (mentalHealth.score !== 75 || mentalHealth.history.length === 0) {
      setMentalHealth(prev => ({
        ...prev,
        history: [...prev.history, prev.score].slice(-20) // Keep last 20 points
      }));
    }
  }, [mentalHealth.score]);

  // Generate content for a single video
  const generateVideoContent = (category) => {
    // Generate base stats
    const baseEngagement = Math.floor(Math.random() * 10000) + 1000;
    const engagementMultiplier = category.engagementLevel;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      category: category,
      watchTime: 0, // Will be updated as user watches
      maxWatchTime: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
      likes: Math.floor(baseEngagement * engagementMultiplier * 0.8),
      comments: Math.floor(baseEngagement * engagementMultiplier * 0.2),
      shares: Math.floor(baseEngagement * engagementMultiplier * 0.1),
      userInteracted: false,
      userLiked: false,
      userCommented: false,
      userShared: false
    };
  };

  // Get next video based on preferences
  const generateNextVideo = () => {
    // Calculate total preference weight
    const totalWeight = Object.values(categoryPreferences).reduce((a, b) => a + b, 0);
    
    // Function to select a category based on weighted preferences
    const selectWeightedCategory = () => {
      let random = Math.random() * totalWeight;
      let sum = 0;
      
      for (const [categoryId, weight] of Object.entries(categoryPreferences)) {
        sum += weight;
        if (random <= sum) {
          return contentCategories.find(c => c.id === categoryId);
        }
      }
      
      // Fallback to random category
      return contentCategories[Math.floor(Math.random() * contentCategories.length)];
    };
    
    // Generate new videos for queue
    const newVideos = Array.from({ length: 3 }, () => {
      const selectedCategory = selectWeightedCategory();
      return generateVideoContent(selectedCategory);
    });
    
    // Update upcoming videos queue
    setUpcomingVideos(prev => {
      const updatedQueue = [...prev, ...newVideos];
      
      // If there's no current video, set the first one as current
      if (!currentVideo) {
        setCurrentVideo(updatedQueue[0]);
        return updatedQueue.slice(1);
      }
      
      return updatedQueue;
    });
  };

  // Move to next video
  const nextVideo = () => {
    // If queue is getting low, generate more videos
    if (upcomingVideos.length < 3) {
      generateNextVideo();
    }
    
    // Set next video as current
    if (upcomingVideos.length > 0) {
      setCurrentVideo(upcomingVideos[0]);
      setUpcomingVideos(prev => prev.slice(1));
    }
  };

  // User interactions with videos
  const interactWithVideo = (interaction, value = true) => {
    if (!currentVideo) return;
    
    // Create a copy of the current video
    const updatedVideo = { ...currentVideo };
    let mentalHealthImpact = 0;
    let categoryImpact = 0;
    
    // Update video based on interaction type
    switch (interaction) {
      case "watch":
        // Increment watch time by 1 second * simulation speed
        updatedVideo.watchTime += 1 * simulationSpeed;
        
        // If this reaches certain thresholds, it impacts preferences
        if (updatedVideo.watchTime >= updatedVideo.maxWatchTime * 0.5 && !updatedVideo.userInteracted) {
          updatedVideo.userInteracted = true;
          categoryImpact = algorithmWeights.watchTime;
          
          // Longer videos have stronger mental health impact
          mentalHealthImpact = currentVideo.category.mentalHealthImpact * 0.5;
        }
        
        // If watched completely, even stronger impact
        if (updatedVideo.watchTime >= updatedVideo.maxWatchTime && !updatedVideo.userInteracted) {
          categoryImpact = algorithmWeights.watchTime * 1.5;
          mentalHealthImpact = currentVideo.category.mentalHealthImpact;
        }
        break;
        
      case "like":
        if (!updatedVideo.userLiked) {
          updatedVideo.userLiked = true;
          updatedVideo.likes += 1;
          categoryImpact = algorithmWeights.likes;
          mentalHealthImpact = currentVideo.category.mentalHealthImpact * 0.5;
          
          // Update engagement metrics
          setEngagementMetrics(prev => ({
            ...prev,
            totalLikes: prev.totalLikes + 1
          }));
        }
        break;
        
      case "comment":
        if (!updatedVideo.userCommented) {
          updatedVideo.userCommented = true;
          updatedVideo.comments += 1;
          categoryImpact = algorithmWeights.comments;
          mentalHealthImpact = currentVideo.category.mentalHealthImpact * 0.3;
          
          // Update engagement metrics
          setEngagementMetrics(prev => ({
            ...prev,
            totalComments: prev.totalComments + 1
          }));
        }
        break;
        
      case "share":
        if (!updatedVideo.userShared) {
          updatedVideo.userShared = true;
          updatedVideo.shares += 1;
          categoryImpact = algorithmWeights.shares;
          mentalHealthImpact = currentVideo.category.mentalHealthImpact * 0.7;
          
          // Update engagement metrics
          setEngagementMetrics(prev => ({
            ...prev,
            totalShares: prev.totalShares + 1
          }));
        }
        break;
        
      case "skip":
        // Implement negative impact on preference for this category
        categoryImpact = algorithmWeights.skips;
        mentalHealthImpact = currentVideo.category.mentalHealthImpact * -0.5; // Small negative impact
        
        // Update engagement metrics
        setEngagementMetrics(prev => ({
            ...prev,
            totalSkips: prev.totalSkips + 1
        }));
        
        // Apply preference change before moving to next video
        updateCategoryPreference(currentVideo.category.id, categoryImpact);
        
        // When skipping, immediately go to next video
        updateMentalHealth(mentalHealthImpact);
        setInteractionCount(prev => prev + 1);
        nextVideo();
        return;
        
      default:
        break;
    }
    
    // Update current video with new stats
    setCurrentVideo(updatedVideo);
    
    // Update category preferences based on interaction
    if (categoryImpact !== 0 && interaction !== "skip") {
      updateCategoryPreference(currentVideo.category.id, categoryImpact);
    }
    
    // Update mental health if there's an impact
    if (mentalHealthImpact !== 0) {
      updateMentalHealth(mentalHealthImpact);
    }
    
    // If user interacted through like/comment/share, move to next video
    if (interaction !== "watch" && interaction !== "skip") {
      setInteractionCount(prev => prev + 1);
      nextVideo();
    }
  };
  
  // Helper function to update category preference
  const updateCategoryPreference = (categoryId, impact) => {
    setCategoryPreferences(prev => {
      const newValue = Math.max(0.5, Math.min(10, prev[categoryId] + impact/10));
      return { ...prev, [categoryId]: newValue };
    });
  };
  
  // Helper function to update mental health
  const updateMentalHealth = (impact) => {
    setMentalHealth(prev => ({
      ...prev,
      score: Math.max(0, Math.min(100, prev.score + impact))
    }));
  };
  
  // Simulate watching current video (auto-increment watch time)
  useEffect(() => {
    if (!currentVideo) return;
    
    const watchInterval = setInterval(() => {
      if (currentVideo.watchTime < currentVideo.maxWatchTime) {
        interactWithVideo("watch");
      } else if (!currentVideo.userInteracted) {
        // If video finishes and user didn't interact, move to next
        setInteractionCount(prev => prev + 1);
        nextVideo();
      }
    }, 1000 / simulationSpeed); // Speed based on simulation speed
    
    return () => clearInterval(watchInterval);
  }, [currentVideo, simulationSpeed]);
  
  // Reset the simulation
  const resetSimulation = () => {
    setCategoryPreferences(
      contentCategories.reduce((acc, category) => {
        acc[category.id] = 1; // Reset to neutral preference
        return acc;
      }, {})
    );
    
    setMentalHealth({
      score: 75,
      history: []
    });
    
    setInteractionCount(0);
    setUpcomingVideos([]);
    setCurrentVideo(null);
    setEngagementMetrics({
      avgWatchTime: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSkips: 0
    });
    
    // Generate a new video
    generateNextVideo();
  };
  
  // Get color class based on mental health score
  const getMentalHealthColor = () => {
    if (mentalHealth.score >= 70) return "text-green-500";
    if (mentalHealth.score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Get a description of the mental health state
  const getMentalHealthDescription = () => {
    if (mentalHealth.score >= 70) return "Good";
    if (mentalHealth.score >= 40) return "Moderate";
    return "Poor";
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white p-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">TikTok Algorithm Simulator</h1>
          <p className="text-xs text-gray-400">How interactions shape your For You Page</p>
        </div>
        
        <div>
          <button 
            onClick={resetSimulation}
            className="bg-red-500 px-4 py-2 rounded text-sm font-medium"
          >
            Reset Simulation
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* FYP Video Feed */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          {/* Current video being shown */}
          <div className="bg-black text-white flex-1 flex flex-col relative">
            {currentVideo ? (
              <>
                {/* Video content placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div 
                    className={`w-16 h-16 rounded-full ${currentVideo.category.color}`}
                  ></div>
                  <h3 className="mt-3 text-lg font-bold">{currentVideo.category.label}</h3>
                  <p className="text-sm text-gray-400">{currentVideo.category.description}</p>
                  
                  {/* Watch time progress */}
                  <div className="mt-6 w-64">
                    <div className="text-xs flex justify-between mb-1">
                      <span>{Math.min(currentVideo.watchTime, currentVideo.maxWatchTime)}s</span>
                      <span>{currentVideo.maxWatchTime}s</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${(currentVideo.watchTime / currentVideo.maxWatchTime) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Interaction buttons */}
                <div className="p-4 flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <button 
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${currentVideo.userLiked ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => interactWithVideo("like")}
                    >
                      <Heart size={20} />
                    </button>
                    <span className="text-xs mt-1">{currentVideo.likes}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <button 
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${currentVideo.userCommented ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => interactWithVideo("comment")}
                    >
                      <MessageCircle size={20} />
                    </button>
                    <span className="text-xs mt-1">{currentVideo.comments}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <button 
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${currentVideo.userShared ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => interactWithVideo("share")}
                    >
                      <Share2 size={20} />
                    </button>
                    <span className="text-xs mt-1">{currentVideo.shares}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                      onClick={() => interactWithVideo("skip")}
                    >
                      <Forward size={20} />
                    </button>
                    <span className="text-xs mt-1">Skip</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading video...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics and algorithm explanation */}
        <div className="w-1/2 overflow-y-auto p-4">
          {/* Mental health impact - just the score, no graph */}
          <div className="mb-6">
            <div className="bg-gray-100 p-3 rounded border border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="font-bold flex items-center">
                  <AlertTriangle size={16} className="text-yellow-500 mr-1" />
                  Mental Wellbeing Impact
                </h2>
                <div className={`${getMentalHealthColor()} font-bold text-lg`}>
                  {getMentalHealthDescription()}: {mentalHealth.score}/100
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This score represents the cumulative impact of content on mental health. 
                Positive content improves wellbeing, while negative content decreases it.
              </p>
            </div>
          </div>
          
          {/* Videos interacted with counter */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">Videos Interacted With: {interactionCount}</h2>
          </div>
          
          {/* Category preferences */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">Your "Preference Profile"</h2>
            <p className="text-xs text-gray-500 mb-2">
              The algorithm tracks what content you engage with and shows you more of it
            </p>
            <div className="space-y-2">
              {contentCategories.map(category => (
                <div key={category.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{category.label}</span>
                      <span className="text-sm font-medium">{categoryPreferences[category.id].toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`${category.color} h-1.5 rounded-full`} 
                        style={{ width: `${Math.min(categoryPreferences[category.id] * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Algorithm explanation toggle */}
          <div>
            <button 
              onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
              className="text-blue-500 text-sm hover:underline"
            >
              {showAlgorithmDetails ? "Hide" : "Show"} Algorithm Details
            </button>
            
            {showAlgorithmDetails && (
              <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded text-sm">
                <h3 className="font-bold mb-2">How The Algorithm Works:</h3>
                <p className="mb-2">
                  This simulation exaggerates TikTok's algorithmic mechanics to clearly demonstrate its impact:
                </p>
                <ul className="space-y-1 mb-3">
                  <li>• <strong>Watch Time</strong>: Watching videos completely increases preference by {algorithmWeights.watchTime}× (heavily weighted in real TikTok)</li>
                  <li>• <strong>Likes</strong>: Liking content increases preference by {algorithmWeights.likes}×</li>
                  <li>• <strong>Comments</strong>: Commenting increases preference by {algorithmWeights.comments}×</li>
                  <li>• <strong>Shares</strong>: Sharing content increases preference by {algorithmWeights.shares}× (most valued engagement)</li>
                  <li>• <strong>Skips</strong>: Skipping decreases preference by {Math.abs(algorithmWeights.skips)}×</li>
                  <li>• <strong>Content type balance</strong>: Notice how negative content often has higher engagement metrics</li>
                </ul>
                <div className="text-xs text-red-500">
                  Note: Real TikTok algorithm uses similar variables but with more sophisticated weighting and patterns. 
                  This demo amplifies effects to clearly demonstrate causality for educational purposes.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}