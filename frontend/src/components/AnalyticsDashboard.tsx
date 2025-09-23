import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { blogAPI, BlogPost } from '../services/api';

export {}; // Ensures this file is treated as a module

// Define props interface for AnalyticsDashboard
interface AnalyticsDashboardProps {
    onBack: () => void; // FIX: Make onBack required as it's used
    posts: BlogPost[]; // Pass posts data from App.tsx
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack, posts }) => { // onBack is now required
    const navigate = useNavigate();
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [publishedPosts, setPublishedPosts] = useState<number>(0);
    const [totalViews, setTotalViews] = useState<number>(0);
    const [avgViewsPerPost, setAvgViewsPerPost] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(true);

    const metricCardRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref for mouse position on cards

    const fetchAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            const totalPostsResponse = await blogAPI.getTotalPostsCount();
            setTotalPosts(totalPostsResponse);

            const publishedPostsResponse = await blogAPI.getPublishedPostsCount();
            setPublishedPosts(publishedPostsResponse);

            if (posts && posts.length > 0) {
                const views = posts.reduce((sum: number, post: BlogPost) => sum + (post.viewCount || 0), 0);
                setTotalViews(views);
                setAvgViewsPerPost((views / posts.length).toFixed(1));
            } else {
                setTotalViews(0);
                setAvgViewsPerPost('0');
            }

            toast.success('Analytics data loaded!');
        } catch (error) {
            console.error("Failed to fetch analytics data:", error);
            toast.error("Failed to load analytics data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [posts]);

    useEffect(() => {
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    const handleMetricCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = metricCardRefs.current[index];
        if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    // Calculate percentages for progress circles
    const totalPostsProgress = totalPosts > 0 ? 100 : 0;
    const publishedPostsProgress = totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0;
    const totalViewsProgress = totalPosts > 0 ? Math.min((totalViews / (totalPosts * 100)) * 100, 100) : 0; // Cap at 100% for display
    const avgViewsProgress = Math.min(parseFloat(avgViewsPerPost) * 10, 100); // Scale avg views for progress circle

    if (loading) {
        return (
            <div className="analytics-dashboard">
                <div style={{ color: 'var(--neon-blue)', fontSize: '1.8rem', fontFamily: "'Orbitron', monospace", padding: '5rem' }}>
                    🔄 Loading Analytics Data...
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            {/* REMOVED: h1 className="analytics-header-title" - this is now rendered in App.tsx */}

            <div className="central-data-core">
                <div className="core-ring-1"></div>
                <div className="core-ring-2"></div>
                <div className="core-ring-3"></div>
                <div className="core-text">DATA STREAM LIVE</div>
            </div>

            <h2 className="analytics-section-header">
                BLOG PERFORMANCE METRICS
            </h2>

            <div className="metrics-grid">
                {/* Metric Card 1: Total Posts */}
                <div
                    className="futuristic-metric-card"
                    onMouseMove={(e) => handleMetricCardMouseMove(e, 0)}
                    ref={el => { metricCardRefs.current[0] = el; }}
                >
                    <div className="progress-circle" style={{ '--target-progress': `${totalPostsProgress}%` } as React.CSSProperties}>
                        <div className="metric-value" style={{ fontSize: '1.5rem', color: 'var(--silver-mist)', textShadow: 'none' }}>{totalPosts}</div>
                    </div>
                    <h3>Total Posts</h3>
                    <div className="metric-chart-bar" style={{ width: `${totalPostsProgress}%` }}></div>
                </div>

                {/* Metric Card 2: Published Posts */}
                <div
                    className="futuristic-metric-card"
                    onMouseMove={(e) => handleMetricCardMouseMove(e, 1)}
                    ref={el => { metricCardRefs.current[1] = el; }}
                >
                    <div className="progress-circle" style={{ '--target-progress': `${publishedPostsProgress}%` } as React.CSSProperties}>
                        <div className="metric-value" style={{ fontSize: '1.5rem', color: 'var(--silver-mist)', textShadow: 'none' }}>{publishedPosts}</div>
                    </div>
                    <h3>Published Posts</h3>
                    <div className="metric-chart-bar" style={{ width: `${publishedPostsProgress}%` }}></div>
                </div>

                {/* Metric Card 3: Total Views */}
                <div
                    className="futuristic-metric-card"
                    onMouseMove={(e) => handleMetricCardMouseMove(e, 2)}
                    ref={el => { metricCardRefs.current[2] = el; }}
                >
                    <div className={`progress-circle ${totalViewsProgress < 30 ? 'red-tint' : ''}`} style={{ '--target-progress': `${totalViewsProgress}%` } as React.CSSProperties}>
                        <div className="metric-value" style={{ fontSize: '1.5rem', color: 'var(--silver-mist)', textShadow: 'none' }}>{totalViews}</div>
                    </div>
                    <h3>Total Views</h3>
                    <div className={`metric-chart-bar ${totalViewsProgress < 30 ? 'red-tint' : ''}`} style={{ width: `${totalViewsProgress}%` }}></div>
                </div>

                {/* Metric Card 4: Avg. Views/Post */}
                <div
                    className="futuristic-metric-card"
                    onMouseMove={(e) => handleMetricCardMouseMove(e, 3)}
                    ref={el => { metricCardRefs.current[3] = el; }}
                >
                    <div className={`progress-circle ${parseFloat(avgViewsPerPost) < 1 ? 'red-tint' : ''}`} style={{ '--target-progress': `${avgViewsProgress}%` } as React.CSSProperties}>
                        <div className="metric-value" style={{ fontSize: '1.5rem', color: 'var(--silver-mist)', textShadow: 'none' }}>{avgViewsPerPost}</div>
                    </div>
                    <h3>Avg. Views/Post</h3>
                    <div className={`metric-chart-bar ${parseFloat(avgViewsPerPost) < 1 ? 'red-tint' : ''}`} style={{ width: `${avgViewsProgress}%` }}></div>
                </div>
            </div>

            <div className="form-actions mt-8" style={{ gridColumn: '1 / -1' }}> {/* Center button */}
                <button className="action-button" onClick={onBack}> {/* FIX: Use onBack prop */}
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
