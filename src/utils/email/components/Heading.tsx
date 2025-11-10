import * as React from 'react';
import { Text } from '@react-email/components';

type HeadingProps = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
};

const headingStyles = {
  1: { fontSize: 28, marginBottom: 12 },
  2: { fontSize: 24, marginBottom: 10 },
  3: { fontSize: 22, marginBottom: 8 },
  4: { fontSize: 20, marginBottom: 8 },
  5: { fontSize: 18, marginBottom: 8 },
  6: { fontSize: 16, marginBottom: 8 },
};

const baseHeadingStyle = {
  fontWeight: 'bold' as const,
  color: '#D83D84',
};

export const Heading = ({ children, level = 1, style }: HeadingProps) => {
  const levelStyle = headingStyles[level];

  return (
    <Text style={{ ...baseHeadingStyle, ...levelStyle, ...style }}>
      {children}
    </Text>
  );
};

// Convenience components for each heading level
export const H1 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={1} style={style}>
    {children}
  </Heading>
);

export const H2 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={2} style={style}>
    {children}
  </Heading>
);

export const H3 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={3} style={style}>
    {children}
  </Heading>
);

export const H4 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={4} style={style}>
    {children}
  </Heading>
);

export const H5 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={5} style={style}>
    {children}
  </Heading>
);

export const H6 = ({ children, style }: Omit<HeadingProps, 'level'>) => (
  <Heading level={6} style={style}>
    {children}
  </Heading>
);
