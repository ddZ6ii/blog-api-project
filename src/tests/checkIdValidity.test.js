import { describe, expect, it } from 'vitest';
import { checkIdValidity } from '../utils/posts';

describe('checkIdValidity', () => {
  it('should throw an error if missing both inputs', () => {
    expect(() => checkIdValidity()).toThrowError('required');
  });
  it('should throw an error if missing posts input', () => {
    let posts;
    expect(() => checkIdValidity(posts, 1)).toThrowError('required');
  });
  it('should throw an error if missing postId input', () => {
    const posts = [
      {
        id: 1,
        title: 'The Rise of Decentralized Finance',
        content:
          'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
        author: 'Alex Thompson',
        date: '2023-08-01T10:00:00Z',
      },
    ];
    expect(() => checkIdValidity(posts)).toThrowError('required');
  });
  it('should throw an error if postId is not of type number', () => {
    const posts = [
      {
        id: 1,
        title: 'The Rise of Decentralized Finance',
        content:
          'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
        author: 'Alex Thompson',
        date: '2023-08-01T10:00:00Z',
      },
    ];
    expect(() => checkIdValidity(posts, '1')).toThrowError('number');
  });
  it('should return true if posts contains a post with id equal to postId', () => {
    const posts = [
      {
        id: 1,
        title: 'The Rise of Decentralized Finance',
        content:
          'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
        author: 'Alex Thompson',
        date: '2023-08-01T10:00:00Z',
      },
    ];
    expect(checkIdValidity(posts, 1)).toBe(true);
  });
});
