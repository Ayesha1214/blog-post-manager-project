export {}; // Added this for isolatedModules error

import React, { useState, useEffect } from 'react';
import { blogAPI, BlogPost } from '../services/api';

interface BlogPostListProps {
  onSelectPost: (post: BlogPost) => void;
  onCreateNew: () => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ onSelectPost, onCreateNew }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'content' | 'tags'>('title');

  useEffect(() => {
    loadPosts();
  }, []);

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      let results: BlogPost[] = [];

      switch (searchType) {
        case 'title':
          results = await blogAPI.searchByTitle(searchTerm);
          break;
        case 'content':
          results = await blogAPI.searchByContent(searchTerm);
          break;
        case 'tags':
          results = await blogAPI.searchByTags(searchTerm);
          break;
      }

      setPosts(results);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="premium-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{
          color: 'var(--neon-blue)',
          fontSize: '1.5rem',
          fontFamily: "'Orbitron', monospace"
        }}>
          🔄 Loading Posts...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      {/* Search Section */}
      <div className="premium-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{
          color: 'var(--deep-blue-title-darker)', /* Made darker */
          marginBottom: '2rem',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.2rem',
          textAlign: 'center',
          textShadow: '0 0 20px var(--neon-blue), 0 0 30px rgba(0, 255, 255, 0.3)' /* Pale cyan glow */
        }}>
          🔍 BLOG POST NEXUS
        </h2>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'content' | 'tags')}
            style={{
              background: 'var(--midnight-blue)',
              border: '2px solid var(--ocean-deep)',
              color: 'var(--pure-white)',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem'
            }}
          >
            <option value="title">Search by Title</option>
            <option value="content">Search by Content</option>
            <option value="tags">Search by Tags</option>
          </select>

          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              width: '100%',
              padding: '1.2rem 1.5rem',
              background: 'linear-gradient(135deg, var(--midnight-blue), var(--ocean-deep))',
              border: '2px solid var(--deep-sky-blue)',
              borderRadius: '12px',
              color: 'var(--pure-white)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 191, 255, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--electric-cyan)';
              e.target.style.boxShadow = '0 4px 20px var(--neon-blue), inset 0 0 15px rgba(0, 255, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--deep-sky-blue)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 191, 255, 0.1)';
            }}
          />

          <button className="premium-button" onClick={handleSearch}>
            🔍 Search
          </button>

          <button className="premium-button" onClick={loadPosts}>
            🔄 Show All
          </button>

          <button className="premium-button" onClick={onCreateNew}>
            ✨ Create New Post
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {posts.length === 0 ? (
          <div className="premium-card" style={{
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
              onClick={() => onSelectPost(post)}
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
    </div>
  );
};

export default BlogPostList;
