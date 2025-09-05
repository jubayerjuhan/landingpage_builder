import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { Check } from 'lucide-react';
import styles from './PricingTable.module.scss';

interface PricingTableProps {
  element: BuilderElement;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonLink?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({ element }) => {
  // Default pricing tiers data
  const defaultTiers: PricingTier[] = [
    {
      name: 'Basic',
      price: '9',
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '1 User Account',
        '10 Projects',
        'Basic Support',
        '1GB Storage'
      ],
      highlighted: false,
      buttonText: 'Get Started'
    },
    {
      name: 'Professional',
      price: '29',
      period: 'month',
      description: 'Most popular choice',
      features: [
        '5 User Accounts',
        'Unlimited Projects',
        'Priority Support',
        '10GB Storage',
        'Advanced Analytics',
        'Custom Domain'
      ],
      highlighted: true,
      buttonText: 'Get Started'
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'month',
      description: 'For large teams',
      features: [
        'Unlimited Users',
        'Unlimited Projects',
        'Dedicated Support',
        'Unlimited Storage',
        'Advanced Analytics',
        'Custom Domain',
        'API Access',
        'White Label'
      ],
      highlighted: false,
      buttonText: 'Contact Sales'
    }
  ];

  const tiers = (element.properties?.tiers as PricingTier[]) || defaultTiers;
  const currency = element.properties?.currency || '$';
  const showDescription = element.properties?.showDescription !== false;

  return (
    <ElementWrapper element={element}>
      <div className={styles.pricingTable}>
        <div className={styles.tiersGrid}>
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`${styles.tier} ${tier.highlighted ? styles.highlighted : ''}`}
            >
              {tier.highlighted && (
                <div className={styles.badge}>Most Popular</div>
              )}
              
              <div className={styles.tierHeader}>
                <h3 className={styles.tierName}>{tier.name}</h3>
                {showDescription && tier.description && (
                  <p className={styles.tierDescription}>{tier.description}</p>
                )}
              </div>

              <div className={styles.tierPricing}>
                <span className={styles.currency}>{currency}</span>
                <span className={styles.price}>{tier.price}</span>
                <span className={styles.period}>/{tier.period}</span>
              </div>

              <div className={styles.tierFeatures}>
                {tier.features.map((feature, fIndex) => (
                  <div key={fIndex} className={styles.feature}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`${styles.tierButton} ${tier.highlighted ? styles.primary : ''}`}
                onClick={() => {
                  if (tier.buttonLink) {
                    window.location.href = tier.buttonLink;
                  }
                }}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ElementWrapper>
  );
};