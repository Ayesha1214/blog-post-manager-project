import React, { useState, useEffect, useCallback } from 'react';
import { blogAPI, BlogPost } from '../services/api';

export {};

interface ViewPostProps {
  postId: number;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: number) => void;
  onBack: () => void;
}

const ViewPost: React.FC<ViewPostProps> = ({ postId, onEdit, onDelete, onBack }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Memoize loadPost to prevent unnecessary re-creations, addressing useEffect warning
  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
      setPost(null); // Set post to null if loading fails
    } finally {
      setLoading(false);
    }
  }, [postId]); // postId is a dependency

  useEffect(() => {
    loadPost();
  }, [loadPost]); // Now correctly depends on loadPost

  const handleDelete = async () => {
    if (!post) return;

    try {
      await blogAPI.deletePost(post.id!);
      onDelete(post.id!);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="view-post-display" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{
          color: 'var(--neon-blue)',
          fontSize: '1.8rem',
          fontFamily: "'Orbitron', monospace",
          animation: 'neon-logo-pulse 2s ease-in-out infinite'
        }}>
          🔄 LOADING BLOG POST...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="view-post-display" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{
          color: '#ff4444',
          marginBottom: '2rem',
          textShadow: '0 0 20px #ff4444, 0 0 30px rgba(255, 0, 0, 0.5)' /* Enhanced red glow */
        }}>
          ❌ POST NOT FOUND
        </h2>
        <button className="premium-button" onClick={onBack}>
          ← Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', width: '100%' }}>
      <div className="view-post-display"> {/* Applied new class */}
        {/* Central Target Marker */}
        <div className="central-target-marker"></div>

        {/* Post Title */}
        <h1 className="view-post-title">
          {post.title}
        </h1>

        {/* Post Summary (if available) */}
        {post.summary && (
          <p className="view-post-text" style={{ marginBottom: '2rem' }}>
            {post.summary}
          </p>
        )}

        {/* Metadata */}
        <div className="view-post-meta">
          <span>✍️ {post.author || 'Anonymous'}</span>
          <span>📅 {new Date(post.createdAt || '').toLocaleDateString()}</span>
          <span>👁️ {post.viewCount || 0} views</span>
          <span style={{
            color: post.published ? 'var(--dark-blue)' : '#ff4444'
          }}>
            {post.published ? '🚀 Published' : '📝 Draft'}
          </span>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="view-post-tags">
            {post.tags.split(',').map((tag, index) => (
              <span key={index}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Post Content */}
        <div style={{
          position: 'relative',
          width: '100%',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.4), rgba(0, 30, 60, 0.3))', /* Darker content background */
          borderRadius: '15px',
          border: '1px solid var(--ocean-deep)',
          boxShadow: '0 5px 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(0, 191, 255, 0.1)',
          marginTop: '3rem',
          marginBottom: '3rem',
          textAlign: 'left' /* Align content left */
        }}>
          <h3 style={{
            color: 'var(--dark-navy)', /* Darker */
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' /* Pale cyan glow */
          }}>
            📄 Full Content
          </h3>
          <div className="view-post-text" style={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'row', /* Changed to row for horizontal buttons */
          gap: '1.5rem',
          justifyContent: 'center', /* Center buttons */
          width: '100%',
          marginTop: '2rem'
        }}>
          <button
            className="premium-button"
            onClick={() => onEdit(post)}
          >
            ✏️ Edit Post
          </button>
          <button
            className="premium-button"
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: 'linear-gradient(135deg, #660000, #cc0000)',
              borderColor: '#ff4444'
            }}
          >
            🗑️ Delete Post
          </button>
          <button
            className="premium-button"
            onClick={onBack}
            style={{
              background: 'linear-gradient(135deg, var(--void-blue), var(--midnight-blue))',
              borderColor: 'var(--ocean-deep)'
            }}
          >
            ← Back to Posts
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="premium-card" style={{
            maxWidth: '500px',
            margin: '2rem',
            textAlign: 'center',
            animation: 'neon-logo-pulse 2s ease-in-out infinite'
          }}>
            <h3 style={{
              color: '#ff4444', // Keep red for warning
              fontSize: '2rem',
              marginBottom: '1.5rem',
              fontFamily: "'Orbitron', monospace",
              textShadow: '0 0 20px #ff4444, 0 0 30px rgba(255, 0, 0, 0.5)' /* Enhanced red glow */
            }}>
              ⚠️ CONFIRM DELETION
            </h3>
            <p style={{
              color: 'var(--pure-white)',
              fontSize: '1.2rem',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Are you sure you want to permanently delete<br/>
              <strong style={{ color: 'var(--electric-cyan)' }}>"{post.title}"</strong>?<br/>
              This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center'
            }}>
              <button
                className="premium-button"
                onClick={handleDelete}
                style={{
                  background: 'linear-gradient(135deg, #660000, #cc0000)',
                  borderColor: '#ff4444'
                }}
              >
                🗑️ DELETE FOREVER
              </button>
              <button
                className="premium-button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  background: 'linear-gradient(135deg, var(--void-blue), var(--midnight-blue))',
                  borderColor: 'var(--ocean-deep)'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
