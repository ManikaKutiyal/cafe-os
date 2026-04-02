import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <div className={styles.copy}>
          <div className={styles.badge}>Built for Modern Cafes</div>
          <h1 className={styles.title}>
            Run your café <span className={styles.accentText}>Digitally</span>
          </h1>
          <p className={styles.description}>
            Elevate your guest experience. Manage digital menus, smart orders, and loyalty rewards from one intuitive dashboard.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button
              className={styles.btnSecondary}
              type="button"
              onClick={() => navigate('/login')}
            >
              Owner Login
            </button>
          </div>
          <div className={styles.meta}>Trusted by 120+ modern cafés.</div>
        </div>

        <div className={styles.visualWrap} aria-hidden="true">
          <div className={styles.visualFlow}>
            <div className={styles.heroVisualInner}>
              <img
                src="/images/hero-visual.png"
                alt="Premium Cafe OS Dashboard"
                className={styles.premiumImage}
              />
            </div>
            <div className={styles.floatingCard1}>
              <div className={styles.statLabel}>Orders processed</div>
              <div className={styles.statValue}>1,280+</div>
            </div>
            <div className={styles.floatingCard2}>
              <div className={styles.statLabel}>Avg satisfaction</div>
              <div className={styles.statValue}>4.9/5</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wavyDivider}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ background: 'transparent' }}>
          <path d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#ffffff" />
        </svg>
      </div>
    </section>

  );
};

export default Hero;
