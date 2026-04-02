import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <div className={styles.copy}>
          <div className={styles.badge}>Built for Modern Cafes</div>
          <h1 className={styles.title}>Run Your Cafe Digitally with Cafe OS</h1>
          <p className={styles.description}>
            Cafe OS helps cafe owners manage QR menus, smart orders, loyalty rewards,
            and customer engagement from one clean dashboard.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className={styles.btnSecondary}
              type="button"
              onClick={() => navigate('/signup')}
            >
              Signup
            </button>
          </div>
          <div className={styles.meta}>No setup hassle. Launch your digital cafe flow in minutes.</div>
        </div>

        <div className={styles.visualWrap} aria-hidden="true">
          <div className={styles.heroVisualInner}>
            <img
              src="/images/hero-visual.png"
              alt="Premium Cafe OS Dashboard"
              className={styles.premiumImage}
            />

            <div className={styles.glassCard}>
              <div className={styles.glassStat}>
                <span className={styles.statLabel}>Revenue</span>
                <span className={styles.statValue}>+24%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
