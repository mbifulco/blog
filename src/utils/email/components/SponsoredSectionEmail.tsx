import {
  Column,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

type SponsoredSectionEmailProps = {
  CTAtext: string;
  sponsorName: string;
  href: string;
  imagePublicId?: string;
  brandColor?: string;
  children: React.ReactNode;
};

/**
 * Email-safe version of SponsoredSection component.
 * Uses @react-email/components for email client compatibility.
 */
export const SponsoredSectionEmail: React.FC<SponsoredSectionEmailProps> = ({
  children,
  CTAtext,
  sponsorName,
  href,
  imagePublicId,
  brandColor = '#db2777',
}) => {
  const getCloudinaryImageUrl = (publicId: string) => {
    return `https://res.cloudinary.com/mikebifulco-com/image/upload/${publicId}`;
  };

  return (
    <Section style={{ paddingTop: 20, paddingBottom: 20 }}>
      {/* Top separator */}
      <Row>
        <Column align="center">
          <Text style={{ color: '#D1D5DB', fontSize: 32, margin: 0 }}>
            * * *
          </Text>
        </Column>
      </Row>

      {/* Sponsor attribution */}
      <Row>
        <Column>
          <Text
            style={{
              fontSize: 12,
              fontStyle: 'italic',
              color: '#9CA3AF',
              textTransform: 'uppercase',
            }}
          >
            Thanks to <strong>{sponsorName}</strong> for sponsoring
          </Text>
        </Column>
      </Row>

      {/* Sponsor image if provided */}
      {imagePublicId && (
        <Row>
          <Column>
            <Link href={href}>
              <Img
                src={getCloudinaryImageUrl(imagePublicId)}
                alt={`Sponsored by ${sponsorName}`}
                style={{
                  width: '100%',
                  borderRadius: 6,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
            </Link>
          </Column>
        </Row>
      )}

      {/* Content */}
      <Row>
        <Column>{children}</Column>
      </Row>

      {/* CTA Button */}
      <Row>
        <Column align="center" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <Link
            href={href}
            style={{
              display: 'inline-block',
              backgroundColor: brandColor,
              color: 'white',
              padding: '10px 24px',
              textDecoration: 'none',
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {CTAtext}
          </Link>
        </Column>
      </Row>

      {/* Bottom separator */}
      <Row>
        <Column align="center">
          <Text style={{ color: '#D1D5DB', fontSize: 32, margin: 0 }}>
            * * *
          </Text>
        </Column>
      </Row>
    </Section>
  );
};

export default SponsoredSectionEmail;
