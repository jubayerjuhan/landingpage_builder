import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import styles from './ContactCard.module.scss';

interface ContactCardProps {
  element: BuilderElement;
}

export const ContactCard: React.FC<ContactCardProps> = ({ element }) => {
  const {
    companyName = "Your Company",
    address = "123 Main Street, City, State 12345",
    phone = "+1 (555) 123-4567",
    email = "contact@company.com",
    website = "www.company.com",
    hours = "Monday - Friday: 9:00 AM - 5:00 PM",
    showMap = false,
    mapUrl = "",
    layout = "vertical" // vertical or horizontal
  } = element.properties || {};

  const contactItems = [
    {
      icon: MapPin,
      label: "Address",
      value: address,
      show: !!address
    },
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone?.replace(/\D/g, '')}`,
      show: !!phone
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      show: !!email
    },
    {
      icon: Globe,
      label: "Website",
      value: website,
      href: website?.startsWith('http') ? website : `https://${website}`,
      show: !!website
    },
    {
      icon: Clock,
      label: "Hours",
      value: hours,
      show: !!hours
    }
  ];

  return (
    <ElementWrapper element={element}>
      <div className={`${styles.contactCard} ${styles[layout]}`}>
        <div className={styles.contactInfo}>
          <h3 className={styles.companyName}>{companyName}</h3>
          
          <div className={styles.contactItems}>
            {contactItems.filter(item => item.show).map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={styles.contactItem}>
                  <Icon size={18} className={styles.icon} />
                  <div className={styles.content}>
                    <span className={styles.label}>{item.label}</span>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className={styles.value}
                        target={item.icon === Globe ? "_blank" : undefined}
                        rel={item.icon === Globe ? "noopener noreferrer" : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className={styles.value}>{item.value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {showMap && mapUrl && (
          <div className={styles.mapSection}>
            <iframe
              src={mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>
        )}
      </div>
    </ElementWrapper>
  );
};