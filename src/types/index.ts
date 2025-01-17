export type SocialMediaKey = 'email' | 'telegram' | 'x' | 'linkedin' | 'github' | 'twitter';

export type SocialMediaItem = {
  type: SocialMediaKey;
  href: string;
};

export type SocialMedia = Record<SocialMediaKey, string>;

export type TeamMember = {
  photo: string;
  title: string;
  desc: string;
  socials: { type: SocialMediaKey; href: string }[];
};

export type CelebrityItem = {
  name: string;
  twitter: string;
  avatar: string;
};

export interface VideoEvent extends Event {
  target: HTMLVideoElement | null;
}
