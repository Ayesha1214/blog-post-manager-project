import React, { useState } from 'react';
import { blogAPI, BlogPost } from '../services/api';

export {};

interface CreatePostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: '',
    tags: '',
    published: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10000 characters';
    }

    if (formData.summary && formData.summary.length > 500) {
      newErrors.summary = 'Summary must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await blogAPI.createPost(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ submit: 'Failed to create post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ animation: 'slideInRight 0.5s ease-out' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h3 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                📝 STEP 1: BASIC INFORMATION
              </h3>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, var(--electric-cyan) 33%, var(--midnight-blue) 33%)',
                borderRadius: '2px',
                marginBottom: '2rem'
              }} />
            </div>

            {/* Title Field with Unique Design */}
            <div style={{
              marginBottom: '2.5rem',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.05), rgba(0, 255, 255, 0.02))',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid var(--ocean-deep)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '20px',
                background: 'linear-gradient(90deg, var(--midnight-blue), var(--ocean-deep))',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                border: '2px solid var(--electric-cyan)'
              }}>
                <span style={{
                  color: 'var(--electric-cyan)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  ✨ POST TITLE
                </span>
              </div>

              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter your captivating blog title..."
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  marginTop: '1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `3px solid ${errors.title ? '#ff4444' : 'var(--electric-cyan)'}`,
                  color: 'var(--pure-white)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = 'var(--neon-blue)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = errors.title ? '#ff4444' : 'var(--electric-cyan)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem'
              }}>
                {errors.title && (
                  <span style={{ color: '#ff4444', fontSize: '0.9rem' }}>
                    ⚠️ {errors.title}
                  </span>
                )}
                <span style={{
                  color: formData.title.length > 180 ? '#ff4444' : 'var(--electric-cyan)',
                  fontSize: '0.9rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginLeft: 'auto'
                }}>
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            {/* Author Field with Floating Label */}
            <div style={{
              marginBottom: '2.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--void-blue), var(--midnight-blue))',
                borderRadius: '15px',
                border: '2px solid var(--ocean-deep)',
                overflow: 'hidden'
              }}>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder=" "
                  style={{
                    width: '100%',
                    padding: '1.5rem 1.5rem 1.5rem 4rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--pure-white)',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1.1rem',
                    outline: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--electric-cyan)',
                  fontSize: '1.2rem'
                }}>
                  👤
                </div>
                <label style={{
                  position: 'absolute',
                  left: '4rem',
                  top: formData.author ? '0.5rem' : '50%',
                  transform: formData.author ? 'translateY(0)' : 'translateY(-50%)',
                  color: 'var(--electric-cyan)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: formData.author ? '0.9rem' : '1.1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none'
                }}>
                  Author Name
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ animation: 'slideInRight 0.5s ease-out' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h3 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                📋 STEP 2: CONTENT DETAILS
              </h3>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, var(--electric-cyan) 66%, var(--midnight-blue) 66%)',
                borderRadius: '2px',
                marginBottom: '2rem'
              }} />
            </div>

            {/* Summary with Card Design */}
            <div style={{
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.03), rgba(0, 255, 255, 0.01))',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid var(--ocean-deep)',
              position: 'relative'
            }}>
              <h4 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.3rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📄 Post Summary
                <span style={{ fontSize: '0.8rem', color: 'var(--pure-white)', opacity: 0.7 }}>
                  (Optional)
                </span>
              </h4>

              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="Write a brief, engaging summary of your post..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '2px solid var(--ocean-deep)',
                  borderRadius: '12px',
                  color: 'var(--pure-white)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--electric-cyan)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--ocean-deep)';
                  e.target.style.boxShadow = 'none';
                }}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem'
              }}>
                {errors.summary && (
                  <span style={{ color: '#ff4444', fontSize: '0.9rem' }}>
                    ⚠️ {errors.summary}
                  </span>
                )}
                <span style={{
                  color: formData.summary.length > 450 ? '#ff4444' : 'var(--electric-cyan)',
                  fontSize: '0.9rem',
                  marginLeft: 'auto'
                }}>
                  {formData.summary.length}/500
                </span>
              </div>
            </div>

            {/* Tags with Chip Design */}
            <div style={{
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.03), rgba(0, 255, 255, 0.01))',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid var(--ocean-deep)'
            }}>
              <h4 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.3rem',
                marginBottom: '1rem'
              }}>
                🏷️ Tags
              </h4>

              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="technology, programming, web-development"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '2px solid var(--ocean-deep)',
                  borderRadius: '12px',
                  color: 'var(--pure-white)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
              />

              <p style={{
                color: 'var(--pure-white)',
                opacity: 0.7,
                fontSize: '0.9rem',
                marginTop: '0.8rem'
              }}>
                Separate tags with commas for better organization
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ animation: 'slideInRight 0.5s ease-out' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h3 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                ✍️ STEP 3: MAIN CONTENT
              </h3>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, var(--electric-cyan) 100%)',
                borderRadius: '2px',
                marginBottom: '2rem'
              }} />
            </div>

            {/* Content Editor */}
            <div style={{
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.03), rgba(0, 255, 255, 0.01))',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid var(--ocean-deep)',
              position: 'relative'
            }}>
              <h4 style={{
                color: 'var(--electric-cyan)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.3rem',
                marginBottom: '1rem'
              }}>
                📝 Your Story
              </h4>

              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Share your thoughts, ideas, and insights with the world..."
                rows={15}
                style={{
                  width: '100%',
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: errors.content ? '2px solid #ff4444' : '2px solid var(--ocean-deep)',
                  borderRadius: '15px',
                  color: 'var(--pure-white)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--electric-cyan)';
                  e.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.content ? '#ff4444' : 'var(--ocean-deep)';
                  e.target.style.boxShadow = 'none';
                }}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem'
              }}>
                {errors.content && (
                  <span style={{ color: '#ff4444', fontSize: '0.9rem' }}>
                    ⚠️ {errors.content}
                  </span>
                )}
                <span style={{
                  color: formData.content.length > 9000 ? '#ff4444' : 'var(--electric-cyan)',
                  fontSize: '0.9rem',
                  marginLeft: 'auto'
                }}>
                  {formData.content.length}/10000
                </span>
              </div>
            </div>

            {/* Publish Toggle */}
            <div style={{
              background: 'linear-gradient(135deg, var(--midnight-blue), var(--ocean-deep))',
              borderRadius: '15px',
              padding: '2rem',
              border: '2px solid var(--electric-cyan)',
              marginBottom: '2rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}>
                <div>
                  <h4 style={{
                    color: 'var(--electric-cyan)',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '1.3rem',
                    marginBottom: '0.5rem'
                  }}>
                    🚀 Publish Immediately
                  </h4>
                  <p style={{
                    color: 'var(--pure-white)',
                    opacity: 0.8,
                    fontSize: '1rem'
                  }}>
                    Make your post visible to readers right away
                  </p>
                </div>
                <div style={{
                  position: 'relative',
                  width: '60px',
                  height: '30px',
                  background: formData.published ? 'var(--electric-cyan)' : 'var(--void-blue)',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleChange('published', !formData.published)}>
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: formData.published ? '33px' : '3px',
                    width: '24px',
                    height: '24px',
                    background: 'var(--pure-white)',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
                  }} />
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <div className="premium-card" style={{
        position: 'relative',
        overflow: 'visible',
        minHeight: '600px'
      }}>
        {/* Form Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <h2 style={{
            color: 'var(--neon-blue)',
            fontFamily: "'Orbitron', monospace",
            fontSize: '2.5rem',
            fontWeight: '900',
            textShadow: '0 0 30px var(--neon-blue)',
            marginBottom: '1rem'
          }}>
            ✨ CREATE NEW POST ✨
          </h2>
          <div style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--electric-cyan), transparent)',
            animation: 'premium-card-scan 3s linear infinite'
          }} />
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Error Display */}
          {errors.submit && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.1), rgba(255, 68, 68, 0.05))',
              border: '2px solid #ff4444',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#ff4444',
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif"
            }}>
              ❌ {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '3rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="premium-button"
                  style={{
                    background: 'linear-gradient(135deg, var(--void-blue), var(--midnight-blue))',
                    borderColor: 'var(--ocean-deep)'
                  }}
                >
                  ← Previous
                </button>
              )}

              <button
                type="button"
                onClick={onCancel}
                className="premium-button"
                style={{
                  background: 'linear-gradient(135deg, #660000, #cc0000)',
                  borderColor: '#ff4444'
                }}
              >
                Cancel
              </button>
            </div>

            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="premium-button"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="premium-button"
                  style={{ minWidth: '150px' }}
                >
                  {isSubmitting ? '🔄 Creating...' : '✨ Create Post'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
