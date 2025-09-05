import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { Linkedin, Twitter, Mail, Globe } from 'lucide-react';
import styles from './TeamMember.module.scss';

interface TeamMemberProps {
  element: BuilderElement;
}

export const TeamMember: React.FC<TeamMemberProps> = ({ element }) => {
  const {
    name = "John Doe",
    role = "Software Engineer",
    bio = "Passionate about creating amazing user experiences and solving complex problems.",
    imageUrl = "",
    email = "",
    linkedin = "",
    twitter = "",
    website = "",
    layout = "vertical" // vertical or horizontal
  } = element.properties || {};

  const renderAvatar = () => {
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt={name}
          className={styles.avatar}
        />
      );
    }
    return (
      <div className={styles.avatarPlaceholder}>
        {name?.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>
    );
  };

  const renderSocialLinks = () => {
    const links = [];
    
    if (email) {
      links.push(
        <a key="email" href={`mailto:${email}`} className={styles.socialLink} title="Email">
          <Mail size={18} />
        </a>
      );
    }
    
    if (linkedin) {
      links.push(
        <a key="linkedin" href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn">
          <Linkedin size={18} />
        </a>
      );
    }
    
    if (twitter) {
      links.push(
        <a key="twitter" href={twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Twitter">
          <Twitter size={18} />
        </a>
      );
    }
    
    if (website) {
      links.push(
        <a key="website" href={website} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Website">
          <Globe size={18} />
        </a>
      );
    }
    
    return links.length > 0 ? (
      <div className={styles.socialLinks}>
        {links}
      </div>
    ) : null;
  };

  return (
    <ElementWrapper element={element}>
      <div className={`${styles.teamMember} ${styles[layout]}`}>
        <div className={styles.imageSection}>
          {renderAvatar()}
        </div>
        
        <div className={styles.contentSection}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.role}>{role}</p>
          {bio && <p className={styles.bio}>{bio}</p>}
          {renderSocialLinks()}
        </div>
      </div>
    </ElementWrapper>
  );
};