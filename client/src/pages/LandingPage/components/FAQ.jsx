import styles from './FAQ.module.css';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        question: 'How easy is it to set up Café OS?',
        answer: 'Extremely easy. Our team provides an onboarding concierge service that gets your entire inventory and menu live within 48 hours. Most café owners are up and running in a single weekend.'
    },
    {
        question: 'Does it work without an internet connection?',
        answer: 'Yes. Our "Coffee-Always-Ready" architecture ensures that offline transactions are stored locally and synchronized as soon as the connection is restored, preventing any interruption in service.'
    },
    {
        question: 'Can I integrate my existing loyalty programs?',
        answer: 'Absolutely. We offer easy import tools for existing CSV data from Square, Toast, or Clover, allowing you to maintain your relationship with regular customers without skipping a beat.'
    },
    {
        question: 'What hardware do I need to get started?',
        answer: 'Café OS is hardware-agnostic. It runs beautifully on iPads, Android tablets, and modern desktop browsers. We also offer curated hardware bundles for a complete, plug-and-play café experience.'
    },
    {
        question: 'Is my data secure and compliant?',
        answer: 'Security is at our core. We use enterprise-grade encryption and are fully PCI-DSS compliant, ensuring all payments and customer data are handled with the highest standards of safety.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <span className={styles.badge}>Doubt Removal</span>
                <h2 className={styles.title}>Everything you need to know</h2>
                <p className={styles.subtitle}>
                    Got questions? We have answers. If you don't find what you're looking for, our support team is available 24/7.
                </p>
            </div>

            <div className={styles.container}>
                {faqs.map((f, idx) => (
                    <div
                        key={idx}
                        className={`${styles.item} ${openIndex === idx ? styles.active : ''}`}
                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                    >
                        <div className={styles.questionWrap}>
                            <h4 className={styles.question}>{f.question}</h4>
                            <div className={styles.icon}>
                                {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                        </div>
                        <div className={styles.answerWrap} style={{ height: openIndex === idx ? 'auto' : 0 }}>
                            <p className={styles.answer}>{f.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
