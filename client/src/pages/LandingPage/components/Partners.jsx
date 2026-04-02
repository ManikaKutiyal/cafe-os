import styles from './Partners.module.css';

const partners = [
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { name: 'Square', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Square%2C_Inc._logo.svg' },
    { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
    { name: 'Shopify', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' }
];

const Partners = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <p className={styles.label}>Seamlessly integrates with</p>
                <div className={styles.grid}>
                    {partners.map((p, idx) => (
                        <img key={idx} src={p.logo} alt={p.name} className={styles.logo} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
