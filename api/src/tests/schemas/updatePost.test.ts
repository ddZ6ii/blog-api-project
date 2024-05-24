import { describe, expect, it } from 'vitest';
import { UpdatePostSchema } from '@/types/updatePost.schema.ts';

const BASE_REQUEST = {
  params: {
    id: '1',
  },
};

describe('UpdatePostSchema', () => {
  it('should fail if provided unexpected entry', () => {
    const body = {
      title: 'New Title',
      content: 'New content...',
      author: 'John Doe',
      any: 'unexpected entry',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if title too short', () => {
    const body = {
      title: '',
      content: 'New content...',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if title too long', () => {
    const tooLongTitle =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar mauris sed ullamcorper accumsan. Morbi ullamcorper massa eu aliquam vestibulum.';
    const body = {
      title: tooLongTitle,
      content: 'New content...',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if content too short', () => {
    const body = {
      title: 'New Title',
      content: '',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if content too long', () => {
    const tooLongContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac lorem placerat, ultricies eros vel, gravida massa. Praesent arcu sem, pretium quis auctor vitae, bibendum feugiat urna. Duis eu scelerisque eros. Nunc eu tincidunt est. Fusce risus nisl, eleifend nec dignissim sit amet, hendrerit vel magna. Quisque ac dapibus sem, sit amet maximus erat. Nunc in tincidunt arcu. Integer tempus odio quis convallis convallis. Morbi volutpat pharetra augue, eget mollis neque gravida ac. Nullam pretium lacus elementum posuere commodo.

Ut dui diam, consequat ut est quis, viverra euismod nisl. Nunc consequat urna vitae dolor dignissim, at interdum est iaculis. Proin eu nisl et eros fermentum faucibus. Duis rutrum, diam vitae lobortis interdum, velit orci molestie neque, pretium auctor ipsum erat eget augue. Proin interdum augue velit, sed mattis metus mollis sed. Fusce at risus augue. Duis nec gravida lectus. Fusce sit amet fermentum nisi. Morbi sit amet nibh condimentum, varius elit in, laoreet odio. Donec nec vehicula nibh, eu fermentum lorem. Nam faucibus, neque vitae mollis ultricies, nisl nibh laoreet sem, eu vulputate felis odio sit amet urna. Ut rhoncus venenatis nunc eu tempor. Aenean facilisis id eros sed dapibus. Suspendisse imperdiet, eros nec gravida eleifend, erat felis lobortis lacus, non fermentum elit leo et ligula. Suspendisse vel lacus mollis velit elementum luctus.

Aliquam pellentesque risus ut orci faucibus ultricies. In ornare turpis at nisi sodales, vitae maximus tortor vulputate. Nulla tincidunt, nisl a lacinia commodo, magna magna ullamcorper urna, sed dictum magna turpis nec purus. Nulla convallis vehicula eros a euismod. Curabitur lacinia velit maximus, facilisis tellus id, laoreet augue. Integer condimentum rutrum orci eu feugiat. Pellentesque cursus lobortis risus id ultricies. Sed sit amet arcu vulputate, feugiat metus sit amet, imperdiet sapien. Aliquam erat volutpat. Nulla viverra laoreet gravida. Sed non hendrerit tellus, sit amet molestie quam. Praesent euismod risus a nibh tristique, at interdum ligula cursus.

Fusce ac nisl ultrices, pharetra nulla eu, dictum elit. Curabitur lorem elit, mattis non ante nec, vestibulum dignissim nisi. Donec ultricies convallis lorem, vel ultricies diam posuere sit amet. Proin commodo turpis sodales turpis semper ultrices. Sed a accumsan risus. Proin non sodales lacus. Nam interdum viverra nisi eget varius. Aliquam pulvinar aliquet leo nec ultrices. Donec at odio sem. Morbi vulputate urna non urna aliquet tincidunt. Vivamus non eleifend dolor. Fusce dictum dapibus malesuada.

Etiam dapibus interdum nibh, et cursus velit efficitur at. Nunc erat sapien, auctor et nisi id, imperdiet ultricies nulla. Donec consequat neque sed lectus luctus, a dictum mi ullamcorper. Mauris sed rutrum ipsum. Aliquam fringilla erat sit amet ante tempor, sed venenatis quam vulputate. Curabitur commodo feugiat lorem, at ultrices purus sollicitudin ac. Ut neque purus, aliquam id tellus quis, venenatis sagittis ex. Ut cursus metus in odio vestibulum dignissim. Nullam molestie nunc pharetra, volutpat mi quis, dignissim magna. Mauris faucibus et purus in volutpat. Proin pulvinar, ante at viverra auctor, lectus enim laoreet justo, sit amet mattis sapien nibh vel mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id nibh sapien. Cras gravida gravida.`;
    const body = {
      title: 'New Title',
      content: tooLongContent,
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if author too short', () => {
    const body = {
      title: '',
      content: 'New content...',
      author: '',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should fail if author too long', () => {
    const tooLongAuthor = 'Lorem ipsum dolor sit amet, consectetur vestibulum.';
    const body = {
      title: 'New Title',
      content: 'New content...',
      author: tooLongAuthor,
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      false,
    );
  });

  it('should pass if no provided entries', () => {
    const body = {};
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      true,
    );
  });

  it('should pass if no provided title', () => {
    const body = {
      content: 'New content...',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      true,
    );
  });

  it('should pass if no provided content', () => {
    const body = {
      title: 'New Title',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      true,
    );
  });

  it('should pass if no provided author', () => {
    const body = {
      title: 'New Title',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      true,
    );
  });

  it('should pass if provided valid post content', () => {
    const body = {
      title: 'New Title',
      content: 'New content...',
      author: 'John Doe',
    };
    expect(UpdatePostSchema.safeParse({ body, ...BASE_REQUEST }).success).toBe(
      true,
    );
  });
});
