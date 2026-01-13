const { TextractClient, AnalyzeDocumentCommand } = require("@aws-sdk/client-textract");

const textract = new TextractClient({});
const BUCKET = process.env.S3_BUCKET;

exports.handler = async (event) => {
  try {
    const { s3Key } = JSON.parse(event.body);

    if (!s3Key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing s3Key" }),
      };
    }

    const command = new AnalyzeDocumentCommand({
      Document: {
        S3Object: { Bucket: BUCKET, Name: s3Key },
      },
      FeatureTypes: ["FORMS"],
    });

    const result = await textract.send(command);
    const extracted = extractFields(result.Blocks);

    return {
      statusCode: 200,
      body: JSON.stringify({ extracted, raw: result.Blocks }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to analyze document" }),
    };
  }
};

function extractFields(blocks) {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};

  blocks.forEach((block) => {
    blockMap[block.Id] = block;
    if (block.BlockType === "KEY_VALUE_SET") {
      if (block.EntityTypes?.includes("KEY")) {
        keyMap[block.Id] = block;
      } else {
        valueMap[block.Id] = block;
      }
    }
  });

  const fields = {};
  Object.values(keyMap).forEach((keyBlock) => {
    const keyText = getText(keyBlock, blockMap);
    const valueBlock = keyBlock.Relationships?.find((r) => r.Type === "VALUE");
    if (valueBlock) {
      const valueId = valueBlock.Ids?.[0];
      if (valueId && valueMap[valueId]) {
        fields[keyText] = getText(valueMap[valueId], blockMap);
      }
    }
  });

  return fields;
}

function getText(block, blockMap) {
  let text = "";
  const childRel = block.Relationships?.find((r) => r.Type === "CHILD");
  if (childRel) {
    childRel.Ids.forEach((id) => {
      const word = blockMap[id];
      if (word?.BlockType === "WORD") {
        text += word.Text + " ";
      }
    });
  }
  return text.trim();
}
