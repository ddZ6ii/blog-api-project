import { describe, expect, it } from 'vitest';
import { countWords } from '@/utils/countWords.ts';

describe('countWords', () => {
  it('should return 0 if no provided input', () => {
    expect(countWords('')).toBe(0);
  });

  it('should return 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('should return 1 if provided a single word', () => {
    expect(countWords('hi')).toBe(1);
  });

  it('should return the exepcted number of words even if complex string (line spaces and/or line breaks)', () => {
    const complexString = ` Suspendisse potenti. Praesent fermentum enim eget tempus pellentesque. Mauris posuere lacus sit amet diam dictum, sed molestie elit interdum. Ut quis pharetra nisl, a vestibulum nulla. Fusce nunc sem, ornare id magna non, dapibus elementum tellus. Aenean ipsum arcu, mollis quis erat id, fringilla laoreet nisi. Cras interdum eu est eu tincidunt. Vivamus dictum viverra condimentum. Morbi ornare iaculis urna vitae molestie. Phasellus porta erat neque, at pellentesque mauris sodales non.


Praesent luctus fringilla mi et mattis. Quisque vitae tellus eget lacus varius imperdiet. Pellentesque sed ligula vel sapien scelerisque vulputate quis vel justo. Pellentesque fringilla rutrum massa imperdiet convallis. Ut sed pulvinar neque, quis mollis nibh. Ut tristique lacus vel mi eleifend dignissim. Pellentesque non euismod nisi. In tincidunt tortor at tellus dapibus, eget tempor augue cursus. Etiam venenatis, leo nec pretium euismod, dolor augue pretium nulla, sed mattis augue felis ac leo. Donec eget velit ligula. 

 Quisque sodal 
`;
    expect(countWords(complexString)).toBe(150);
  });
});
