import styles from './Testimonials.module.css';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Owner, The Roasted Bean',
        content: 'Café OS transformed how we handle peak hours. The real-time inventory tracking and seamless digital menus reduced our customer wait time by nearly 40%. It’s a game-changer for any serious café owner.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop'
    },
    {
        name: 'James Chen',
        role: 'Founder, Urban Brews',
        content: 'The most intuitive platform I’ve used. Most POS systems are clunky, but Café OS is elegant. Our baristas love the interface, and our customers appreciate the integrated loyalty program.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop'
    },
    {
        name: 'Elena Rodriguez',
        role: 'Manager, Artisan Coffee Co.',
        content: 'Managing multiple locations used to be a nightmare. Now, I have a single dashboard that gives me a bird’s-eye view of everything from sales to staff performance. Truly indispensable.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop'
    }
];

const Testimonials = () => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <span className={styles.badge}>Social Proof</span>
                <h2 className={styles.title}>Trusted by the world's finest cafés</h2>
                <p className={styles.subtitle}>
                    Don’t just take our word for it—join hundreds of modern café owners who are scaling their businesses with Café OS.
                </p>
            </div>

            <div className={styles.grid}>
                {testimonials.map((t, idx) => (
                    <div key={idx} className={styles.card}>
                        <div className={styles.quoteIcon}>
                            <Quote size={20} fill="currentColor" />
                        </div>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill="#d4a373" color="#d4a373" />
                            ))}
                        </div>
                        <p className={styles.content}>"{t.content}"</p>
                        <div className={styles.author}>
                            <img src={t.avatar} alt={t.name} className={styles.avatar} />
                            <div className={styles.info}>
                                <h4 className={styles.name}>{t.name}</h4>
                                <p className={styles.role}>{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
