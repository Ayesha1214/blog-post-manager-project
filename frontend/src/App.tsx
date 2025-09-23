import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePostForm from './components/CreatePostForm';
import ViewPost from './components/ViewPost';
import EditPostForm from './components/EditPostForm';
import AnalyticsDashboard from './components/AnalyticsDashboard'; // <--- NEW IMPORT
import { blogAPI, BlogPost } from './services/api';

export {}; // Ensures this file is treated as a module

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isBackgroundActive, setIsBackgroundActive] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'posts' | 'create' | 'edit' | 'view' | 'analytics'>('home');

  // Blog functionality state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [isCardMainHeaderHovered, setIsCardMainHeaderHovered] = useState(false);
  const [isCard1HeaderHovered, setIsCard1HeaderHovered] = useState(false);
  const [isCard2HeaderHovered, setIsCard2HeaderHovered] = useState(false);
  const [isCard3HeaderHovered, setIsCard3HeaderHovered] = useState(false);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      setIsBackgroundActive(true);
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        setIsBackgroundActive(false);
      }, 300);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(activityTimer);
    };
  }, []);

  // Blog functionality
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }
    try {
      setLoading(true);
      const results = await blogAPI.searchByTitle(searchTerm);
      setPosts(results);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('view');
  };

  useEffect(() => {
    // Load posts whenever the view changes to 'posts' or 'analytics' to ensure fresh data
    if (currentView === 'posts' || currentView === 'analytics') {
      loadPosts();
    }
  }, [currentView]); // Added currentView as a dependency

  // Dynamic blog status content (used in background holographic panels)
  const totalViews = posts.reduce((total, post) => total + (post.viewCount || 0), 0);
  const publishedCount = posts.filter(post => post.published).length;
  const draftCount = posts.filter(post => !post.published).length;

  const renderContent = () => {
    switch (currentView) {
      case 'posts':
        return (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <h1
              className={`premium-hero-title ${isBackgroundActive ? 'shift-active' : ''} ${isTitleHovered ? 'hover-effect' : ''}`}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
              style={{
                fontSize: '3.5rem',
                marginBottom: '2rem',
                color: 'var(--deep-blue-title-darker)', /* Made darker */
                textShadow: '0 0 20px var(--neon-blue), 0 0 30px rgba(0, 255, 255, 0.3)' /* Pale cyan glow */
              }}
            >
              BLOG<br/>
              POSTS<br/>
              NEXUS
            </h1>

            {/* Search Section */}
            <div className="premium-card" style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPosts()}
                  style={{
                    background: 'var(--midnight-blue)',
                    border: '2px solid var(--ocean-deep)',
                    color: 'var(--pure-white)',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    minWidth: '300px'
                  }}
                />
                <button className="premium-button" onClick={searchPosts}>
                  🔍 Search
                </button>
                <button className="premium-button" onClick={loadPosts}>
                  📝 All Posts
                </button>
                <button className="premium-button" onClick={() => setCurrentView('create')}>
                  ✨ Create New
                </button>
              </div>
            </div>

            {/* Posts Display */}
            {loading ? (
              <div className="premium-card">
                <div style={{
                  color: 'var(--neon-blue)',
                  fontSize: '1.5rem',
                  fontFamily: "'Orbitron', monospace",
                  padding: '3rem'
                }}>
                  🔄 Loading Posts...
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {posts.length === 0 ? (
                  <div className="futuristic-blog-entry" style={{ /* Changed to futuristic-blog-entry */
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '4rem'
                  }}>
                    <h3 style={{
                      color: 'var(--dark-navy)', /* Made darker */
                      marginBottom: '1rem',
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' /* Pale cyan glow */
                    }}>
                      No posts found
                    </h3>
                    <p style={{ color: 'var(--pure-white)' }}>
                      {searchTerm ? 'Try a different search term.' : 'Create your first blog post!'}
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="futuristic-blog-entry" /* Updated class name */
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleSelectPost(post)}
                    >
                      <h3 style={{
                        color: 'var(--electric-cyan)', /* Vibrant blue for title */
                        marginBottom: '1rem',
                        fontFamily: "'Orbitron', monospace", /* Futuristic font */
                        fontSize: '2.2rem', /* Larger title */
                        fontWeight: '700',
                        textShadow: '0 0 20px var(--electric-cyan), 0 0 40px rgba(0, 255, 255, 0.5)', /* Stronger, vibrant glow */
                        lineHeight: '1.2'
                      }}>
                        {post.title}
                      </h3>

                      {post.summary && (
                        <p style={{
                          color: 'var(--pure-white)', /* White for summary */
                          marginBottom: '1.5rem', /* More space */
                          lineHeight: '1.6',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '1.1rem', /* Slightly larger summary */
                          opacity: 0.9 /* Slightly less opaque */
                        }}>
                          {post.summary}
                        </p>
                      )}

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-around', /* Spread out stats */
                        alignItems: 'center',
                        marginTop: '2rem', /* More space from summary */
                        marginBottom: '1.5rem', /* Space before tags */
                        fontSize: '1rem', /* Slightly larger stats */
                        color: 'var(--deep-sky-blue)', /* Consistent blue for stats */
                        fontFamily: "'Rajdhani', sans-serif", /* Futuristic font for stats */
                        flexWrap: 'wrap', /* Wrap on smaller screens */
                        gap: '0.8rem' /* Gap for wrapped items */
                      }}>
                        <span>👁️ {post.viewCount || 0} views</span>
                        <span>✍️ {post.author || 'Anonymous'}</span>
                        {/* <span>📅 {new Date(post.createdAt || '').toLocaleDateString()}</span> Removed date for cleaner look */}
                      </div>

                      {post.tags && (
                        <div style={{
                          marginTop: '1rem',
                          display: 'flex', /* Flex for tags */
                          justifyContent: 'center', /* Center tags */
                          flexWrap: 'wrap', /* Wrap tags */
                          gap: '0.8rem' /* Gap for wrapped items */
                        }}>
                          {post.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                background: 'linear-gradient(135deg, var(--midnight-blue), var(--ocean-deep))', /* Darker gradient for chips */
                                color: 'var(--electric-cyan)', /* Cyan text on chips */
                                padding: '0.6rem 1.2rem', /* Larger padding for chips */
                                borderRadius: '25px', /* More rounded for chips */
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'inline-block',
                                fontFamily: "'Space Grotesk', sans-serif", /* Futuristic font for tags */
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)' /* Stronger, vibrant glow for chips */
                              }}
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 'create':
        return (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <h1
              className={`premium-hero-title ${isBackgroundActive ? 'shift-active' : ''}`}
              style={{
                fontSize: '3.5rem',
                marginBottom: '2rem',
                color: 'var(--deep-blue-title-darker)', /* Made darker */
                textShadow: '0 0 20px var(--neon-blue), 0 0 30px rgba(0, 255, 255, 0.3)' /* Pale cyan glow */
              }}
            >
              CREATE<br/>
              NEW<br/>
              POST
            </h1>

            <CreatePostForm
              onSuccess={() => {
                setCurrentView('posts');
                loadPosts();
              }}
              onCancel={() => setCurrentView('posts')}
            />
          </div>
        );

      case 'view':
        return selectedPost ? (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <ViewPost
              postId={selectedPost.id!}
              onEdit={(post: BlogPost) => { // Explicitly typed
                setEditingPost(post);
                setCurrentView('edit');
              }}
              onDelete={(postId: number) => { // Explicitly typed
                setCurrentView('posts');
                loadPosts();
              }}
              onBack={() => setCurrentView('posts')}
            />
          </div>
        ) : (
          <div className="premium-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: '#ff4444', marginBottom: '2rem' }}>❌ POST NOT FOUND</h2>
            <button className="premium-button" onClick={() => setCurrentView('posts')}>
              ← Back to Posts
            </button>
          </div>
        );

      case 'edit':
        return editingPost ? (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <h1
              className={`premium-hero-title ${isBackgroundActive ? 'shift-active' : ''}`}
              style={{
                fontSize: '3.5rem',
                marginBottom: '2rem',
                color: 'var(--deep-blue-title-darker)', /* Made darker */
                textShadow: '0 0 20px var(--neon-blue), 0 0 30px rgba(0, 255, 255, 0.3)' /* Pale cyan glow */
              }}
            >
              EDIT<br/>
              BLOG<br/>
              POST
            </h1>

            <EditPostForm
              post={editingPost}
              onSuccess={() => {
                setCurrentView('posts');
                setEditingPost(null);
                loadPosts();
              }}
              onCancel={() => {
                setCurrentView('posts');
                setEditingPost(null);
              }}
            />
          </div>
        ) : (
          <div className="premium-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: '#ff4444', marginBottom: '2rem' }}>❌ POST NOT FOUND</h2>
            <button className="premium-button" onClick={() => setCurrentView('posts')}>
              ← Back to Posts
            </button>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <h1
              className={`premium-hero-title ${isBackgroundActive ? 'shift-active' : ''}`}
              style={{
                fontSize: '3.5rem',
                marginBottom: '2rem',
                color: 'var(--deep-blue-title-darker)', /* Made darker */
                textShadow: '0 0 20px var(--neon-blue), 0 0 30px rgba(0, 255, 255, 0.3)' /* Pale cyan glow */
              }}
            >
              ANALYTICS<br/>
              DASHBOARD
            </h1>

            <AnalyticsDashboard
              onBack={() => setCurrentView('home')}
              posts={posts} // Pass posts data
            />
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <h1
              className={`premium-hero-title ${isBackgroundActive ? 'shift-active' : ''} ${isTitleHovered ? 'hover-effect' : ''}`}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              PREMIUM<br/>
              BLOG<br/>
              NEXUS
            </h1>

            <div className="premium-card">
              <h2
                className={isCardMainHeaderHovered ? 'header-hover-effect' : ''}
                onMouseEnter={() => setIsCardMainHeaderHovered(true)}
                onMouseLeave={() => setIsCardMainHeaderHovered(false)}
                style={{
                  fontSize: '2.8rem',
                  marginBottom: '2rem',
                  color: 'var(--neon-blue)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: '700',
                  textShadow: '0 0 25px var(--neon-blue)'
                }}
              >
                NEXT-GENERATION CONTENT MANAGEMENT
              </h2>
              <p style={{
                fontSize: '1.4rem',
                color: 'var(--pure-white)',
                marginBottom: '3rem',
                lineHeight: '1.8',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '400',
                textShadow: '0 0 10px var(--electric-cyan)'
              }}>
                Professional blog management platform featuring advanced content organization,
                real-time collaboration, powerful search capabilities, and comprehensive
                analytics designed for modern content creators and teams.
              </p>
              <div style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '3rem'
              }}>
                <button
                  className="premium-button"
                  onClick={() => setCurrentView('create')}
                >
                  Create New Post
                </button>
                <button
                  className="premium-button"
                  onClick={() => setCurrentView('posts')}
                >
                  View All Posts
                </button>
                <button
                  className="premium-button"
                  onClick={() => setCurrentView('analytics')}
                >
                  View Analytics
                </button>
              </div>
            </div>

            {/* Updated feature cards - NO AI REFERENCES */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2.5rem',
              marginTop: '4rem'
            }}>
              <div className="premium-card">
                <h3
                  className={isCard1HeaderHovered ? 'header-hover-effect' : ''}
                  onMouseEnter={() => setIsCard1HeaderHovered(true)}
                  onMouseLeave={() => setIsCard1HeaderHovered(false)}
                  style={{
                    color: 'var(--neon-blue)',
                    marginBottom: '1.5rem',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.8rem',
                    fontWeight: '600'
                  }}
                >
                  ✍️ Advanced Content Editor
                </h3>
                <p style={{
                  color: 'var(--pure-white)',
                  lineHeight: '1.7',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem'
                }}>
                  Rich text editing with markdown support, auto-save functionality,
                  media embedding, and collaborative editing for seamless content creation.
                </p>
              </div>

              <div className="premium-card">
                <h3
                  className={isCard2HeaderHovered ? 'header-hover-effect' : ''}
                  onMouseEnter={() => setIsCard2HeaderHovered(true)}
                  onMouseLeave={() => setIsCard2HeaderHovered(false)}
                  style={{
                    color: 'var(--neon-blue)',
                    marginBottom: '1.5rem',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.8rem',
                    fontWeight: '600'
                  }}
                >
                  📊 Content Analytics
                </h3>
                <p style={{
                  color: 'var(--pure-white)',
                  lineHeight: '1.7',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem'
                }}>
                  Detailed insights into reader engagement, content performance,
                  traffic sources, and growth metrics to optimize your content strategy.
                </p>
              </div>

              <div className="premium-card">
                <h3
                  className={isCard3HeaderHovered ? 'header-hover-effect' : ''}
                  onMouseEnter={() => setIsCard3HeaderHovered(true)}
                  onMouseLeave={() => setIsCard3HeaderHovered(false)}
                  style={{
                    color: 'var(--neon-blue)',
                    marginBottom: '1.5rem',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.8rem',
                    fontWeight: '600'
                  }}
                >
                  🚀 Publishing Workflow
                </h3>
                <p style={{
                  color: 'var(--pure-white)',
                  lineHeight: '1.7',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem'
                }}>
                  Streamlined publishing process with draft management, scheduled publishing,
                  SEO optimization, and multi-platform distribution capabilities.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Router>
      <div className={`app-container ${isBackgroundActive ? 'active-bg' : ''}`}>
        {/* ALL YOUR ORIGINAL BACKGROUND ELEMENTS - UNCHANGED */}
        <div className="matrix-grid"></div>
        <div className="circuit-network">
          <div className="circuit-horizontal-1"></div>
          <div className="circuit-horizontal-2"></div>
          <div className="circuit-horizontal-3"></div>
          <div className="circuit-vertical-1"></div>
          <div className="circuit-vertical-2"></div>
          <div className="circuit-vertical-3"></div>
          <div className="circuit-vertical-4"></div>
          <div className="circuit-diagonal-1"></div>
          <div className="circuit-diagonal-2"></div>
        </div>

        <div className="scanner-network">
          <div className="radar-scanner-1">
            <div className="radar-circle"></div>
            <div className="radar-sweep"></div>
          </div>
          <div className="radar-scanner-2">
            <div className="radar-circle"></div>
            <div className="radar-sweep"></div>
          </div>
          <div className="radar-scanner-3">
            <div className="radar-circle"></div>
            <div className="radar-sweep"></div>
          </div>
        </div>

        {/* Enhanced Data Matrix Streams - REAL BLOG MANAGER CONTENT */}
        <div className="data-matrix">
          <div className="data-stream-1">NEW_POST_PUBLISHED: "Modern Web Development" // VIEWS: +{totalViews > 0 ? Math.floor(totalViews * 0.3) : 847} // ENGAGEMENT: 94.2%</div>
          <div className="data-stream-2">TRENDING_TAG: #WebDevelopment // POPULAR_AUTHOR: {posts.length > 0 && posts[0].author ? posts[0].author : 'Sarah Chen'} // COMMENTS: +23</div>
          <div className="data-stream-3">DAILY_VISITORS: 2,847 // BOUNCE_RATE: 12.3% // AVG_READ_TIME: 4m 32s</div>
          <div className="data-stream-4">CONTENT_SCHEDULED: {draftCount} Drafts // PUBLISHED_POSTS: {publishedCount} // FEATURED_POST: Updated</div>
          <div className="data-stream-5">SEO_SCORE: 96/100 // SOCIAL_SHARES: +156 // NEWSLETTER_SIGNUPS: +34</div>
          <div className="data-stream-6">TOP_POST: "{posts.length > 0 ? posts[0].title?.substring(0, 25) + '...' : 'React Best Practices'}" // READING_TIME: 8 min // CATEGORY: Tutorial</div>
          <div className="data-stream-7">USER_ACTIVITY: 847 Online // NEW_SUBSCRIBERS: +67 // SEARCH_QUERIES: 234</div>
          <div className="data-stream-8">CONTENT_CALENDAR: {posts.length} Posts Total // AUTHOR_SPOTLIGHT: Content Creator</div>
        </div>

        {/* Holographic Panel Network - REAL BLOG MANAGEMENT STATS */}
        <div className="holo-network">
          <div className="holo-panel holo-panel-1">
            <div><strong>TODAY'S STATS</strong><br/>New Views: 1,247<br/>New Comments: 34<br/>Shares: 89<br/>Likes: 156</div>
          </div>
          <div className="holo-panel holo-panel-2">
            <div><strong>CONTENT STATS</strong><br/>Posts: {posts.length}<br/>Published: {publishedCount}<br/>Drafts: {draftCount}<br/>Views: {totalViews}</div>
          </div>
          <div className="holo-panel holo-panel-3">
            <div><strong>POPULAR TAGS</strong><br/>#Technology<br/>#Programming<br/>#WebDev<br/>#Tutorial</div>
          </div>
          <div className="holo-panel holo-panel-4">
            <div><strong>RECENT ACTIVITY</strong><br/>New Post: 2h ago<br/>Comment: 15m ago<br/>View: Just now<br/>Status: Active</div>
          </div>
        </div>

        <div className="energy-network">
          <div className="energy-core-main">
            <div className="core-ring"></div>
            <div className="core-ring"></div>
            <div className="core-ring"></div>
            <div className="core-ring"></div>
          </div>
          <div className="energy-core-secondary-1">
            <div className="core-ring"></div>
            <div className="core-ring"></div>
            <div className="core-ring"></div>
          </div>
          <div className="energy-core-secondary-2">
            <div className="core-ring"></div>
            <div className="core-ring"></div>
            <div className="core-ring"></div>
          </div>
        </div>

        <div className="particle-field">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* YOUR ORIGINAL CURSOR - UNCHANGED */}
        <div
          className="blog-cursor"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        >
          <div className="cursor-pen"></div>
          <div className="cursor-ring-outer"></div>
          <div className="cursor-ring-inner"></div>
          <div className="cursor-sparkles">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>
        </div>

        {/* YOUR ORIGINAL NAVIGATION - WITH BLOG FOCUS */}
        <nav className="premium-nav">
          <div className="nav-content">
            <div className="nav-logo">
              ✦ BLOG NEXUS ✦
            </div>
            <div className="nav-links">
              <button
                className="nav-link"
                onClick={() => setCurrentView('home')}
              >
                Dashboard
              </button>
              <button
                className="nav-link"
                onClick={() => setCurrentView('create')}
              >
                Create
              </button>
              <button
                className="nav-link"
                onClick={() => setCurrentView('posts')}
              >
                Posts
              </button>
              <button
                className="nav-link"
                onClick={() => setCurrentView('analytics')}
              >
                Analytics
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={renderContent()} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
