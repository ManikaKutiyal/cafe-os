import { useState } from 'react';
import { Zap, Users, BookOpen, MessageSquare, ChevronRight } from 'lucide-react';
import styles from './Benefits.module.css';

const benefits = [
  {
    icon: <Zap size={24} />,
    title: 'Faster Ordering',
    description: 'Digital ordering reduces wait times and improves service efficiency across your café. Your customers will love the instant access.',
    details: ['40% reduction in wait times', 'Auto-sync with kitchen', 'Direct customer-to-barista flow'],
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=600&h=400&auto=format&fit=crop'
  },
  {
    icon: <Users size={24} />,
    title: 'Better Engagement',
    description: 'Reward systems and reviews help build stronger, lasting relationships with customers. Turn your first-time visitors into regulars.',
    details: ['Integrated loyalty points', 'Direct feedback loop', 'Personalized offers'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&h=400&auto=format&fit=crop'
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Digital Menu System',
    description: 'Easily update menus anytime — no printing costs, no delays. Adjust prices or items globally in seconds.',
    details: ['Real-time price updates', 'OOS item hiding', 'Visual image-rich menus'],
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&h=400&auto=format&fit=crop'
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Feedback Collection',
    description: 'Collect ratings and reviews to continuously improve your service quality. Know exactly what your customers think.',
    details: ['Detailed star ratings', 'Instant text reviews', 'Sentiment analysis'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&h=400&auto=format&fit=crop'
  },
];

const Benefits = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section} id="benefits">
      <div className={styles.header}>
        <span className={styles.badge}>Deeper Value</span>
        <h2 className={styles.title}>Why Café OS?</h2>
        <p className={styles.subtitle}>
          Everything you need to run a modern, efficient and customer-loved café — organized in one place.
        </p>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className={`${styles.navItem} ${activeIndex === idx ? styles.active : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className={styles.navIcon}>{b.icon}</div>
              <div className={styles.navText}>
                <h4 className={styles.navTitle}>{b.title}</h4>
                <p className={styles.navDesc}>{b.description.slice(0, 60)}...</p>
              </div>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          ))}
        </div>

        <div className={styles.contentWrap}>
          <div className={styles.visualSide} key={activeIndex}>
            <div className={styles.imageWrap}>
              <img src={benefits[activeIndex].image} alt={benefits[activeIndex].title} className={styles.mainImage} />
              <div className={styles.overlay} />
            </div>

            <div className={styles.detailsSide}>
              <h3 className={styles.benefitTitle}>{benefits[activeIndex].title}</h3>
              <p className={styles.benefitDesc}>{benefits[activeIndex].description}</p>

              <ul className={styles.pointsList}>
                {benefits[activeIndex].details.map((point, i) => (
                  <li key={i} className={styles.pointItem}>
                    <div className={styles.check}>✓</div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
