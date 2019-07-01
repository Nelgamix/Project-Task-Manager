export const LinkModel = {
  name: String,
  description: String,
  url: String,
};

export const DateModel = {
  type: Number,
  default: Date.now,
};

export interface ILink {
  name: string;
  description: string;
  url: string;
}
