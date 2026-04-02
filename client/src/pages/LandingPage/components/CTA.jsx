import styles from './CTA.module.css';

const CTA = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.badge}>Get Started</span>
                    <h2 className={styles.title}>Ready to refine your craft?</h2>
                    <p className={styles.subtitle}>
                        Join the elite community of café owners who are using Café OS to scale their businesses. Experience the platform that's as smooth as your best espresso.
                    </p>
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary}>Start Free Trial</button>
                        <button className={styles.btnSecondary}>Request Demo</button>
                    </div>
                    <p className={styles.meta}>No credit card required • 14-day free trial • Cancel anytime</p>
                </div>
            </div>
        </section>
    );
};

export default CTA;
