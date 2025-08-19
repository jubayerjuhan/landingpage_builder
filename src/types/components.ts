import type { StyleObject } from './styles';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  styles: StyleObject;
  content?: string;
  children?: BaseComponent[];
}

export enum ComponentType {
  BUTTON = 'button',
  TEXT = 'text',
  HEADING = 'heading',
  IMAGE = 'image',
  CONTAINER = 'container',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CARD = 'card',
  SECTION = 'section',
}

export interface ButtonComponent extends BaseComponent {
  type: ComponentType.BUTTON;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export interface TextComponent extends BaseComponent {
  type: ComponentType.TEXT;
  content: string;
  tag?: 'p' | 'span' | 'div';
}

export interface HeadingComponent extends BaseComponent {
  type: ComponentType.HEADING;
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ImageComponent extends BaseComponent {
  type: ComponentType.IMAGE;
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
}

export interface ContainerComponent extends BaseComponent {
  type: ComponentType.CONTAINER;
  children: BaseComponent[];
  maxWidth?: string;
  centered?: boolean;
}

export interface InputComponent extends BaseComponent {
  type: ComponentType.INPUT;
  placeholder?: string;
  value?: string;
  inputType?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
}

export interface TextareaComponent extends BaseComponent {
  type: ComponentType.TEXTAREA;
  placeholder?: string;
  value?: string;
  rows?: number;
  required?: boolean;
}

export interface CardComponent extends BaseComponent {
  type: ComponentType.CARD;
  children: BaseComponent[];
  shadow?: boolean;
  border?: boolean;
}

export interface SectionComponent extends BaseComponent {
  type: ComponentType.SECTION;
  children: BaseComponent[];
  padding?: string;
  backgroundColor?: string;
}

export type AnyComponent =
  | ButtonComponent
  | TextComponent
  | HeadingComponent
  | ImageComponent
  | ContainerComponent
  | InputComponent
  | TextareaComponent
  | CardComponent
  | SectionComponent;
