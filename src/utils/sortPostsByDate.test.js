import { describe, expect, it } from 'vitest';
import { sortPostsByDate } from '../utils/posts.js';

const POSTS = [
  {
    id: 1,
    title: 'The Rise of Decentralized Finance',
    content:
      'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
    author: 'Alex Thompson',
    date: '2023-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'The Impact of Artificial Intelligence on Modern Businesses',
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: 'Mia Williams',
    date: '2023-08-05T14:30:00Z',
  },
];

describe('sortPostsByDate', () => {
  it('should throw an error if order is missing', () => {
    expect(() => sortPostsByDate(POSTS)).toThrowError(
      'Order input is missing.',
    );
  });
  it('should throw an error if order is not of type string', () => {
    expect(() => sortPostsByDate(3, POSTS)).toThrowError('string');
  });
  it('should throw an error if order is not either ASC or DESC', () => {
    expect(() => sortPostsByDate('dsd', POSTS)).toThrowError(
      'order must either be DESC or ASC.',
    );
  });
  it('should return most recent date first', () => {
    expect(sortPostsByDate('desc', POSTS)[0].date).toBe('2023-08-05T14:30:00Z');
  });
  it('should return most recent date first', () => {
    expect(sortPostsByDate('asc', POSTS)[0].date).toBe('2023-08-01T10:00:00Z');
  });
});
