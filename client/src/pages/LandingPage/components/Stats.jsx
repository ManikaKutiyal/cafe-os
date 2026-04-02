import styles from './Stats.module.css';

const stats = [
    { label: 'Cafés Scaling', value: '1,200+' },
    { label: 'Daily Transactions', value: '85k+' },
    { label: 'Revenue Growth', value: '24%' },
    { label: 'Global Locations', value: '18+' }
];

const Stats = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {stats.map((s, idx) => (
                        <div key={idx} className={styles.statLine}>
                            <h3 className={styles.value}>{s.value}</h3>
                            <p className={styles.label}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
