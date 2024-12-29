import type { StructuredDataWithType } from '@utils/generateStructuredData';

const StructuredData = ({
  structuredData,
}: {
  structuredData: StructuredDataWithType[] | StructuredDataWithType;
}) => {
  const structuredDataArray = Array.isArray(structuredData)
    ? structuredData
    : [structuredData];

  return (
    <>
      {structuredDataArray.map((structuredData) => (
        <script
          key={structuredData['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
