const fs = require("fs");
const axios = require("axios");

const saveDirectory = "./bible";

const newChaptersWithTotalVerses = [
  {
    name: "Genesis",
    totalChapter: 50,
  },
  {
    name: "Exodus",
    totalChapter: 40,
  },
  {
    name: "Leviticus",
    totalChapter: 27,
  },
  {
    name: "Numbers",
    totalChapter: 36,
  },
  {
    name: "Deuteronomy",
    totalChapter: 34,
  },
  {
    name: "Joshua",
    totalChapter: 24,
  },
  {
    name: "Judges",
    totalChapter: 21,
  },
  {
    name: "Ruth",
    totalChapter: 4,
  },
  {
    name: "1 Samuel",
    totalChapter: 31,
  },
  {
    name: "2 Samuel",
    totalChapter: 24,
  },
  {
    name: "1 Kings",
    totalChapter: 22,
  },
  {
    name: "2 Kings",
    totalChapter: 25,
  },
  {
    name: "1 Chronicles",
    totalChapter: 29,
  },
  {
    name: "2 Chronicles",
    totalChapter: 36,
  },
  {
    name: "Ezra",
    totalChapter: 10,
  },
  {
    name: "Nehemiah",
    totalChapter: 13,
  },
  {
    name: "Esther",
    totalChapter: 10,
  },
  {
    name: "Job",
    totalChapter: 42,
  },
  {
    name: "Psalms",
    totalChapter: 150,
  },
  {
    name: "Proverbs",
    totalChapter: 31,
  },
  {
    name: "Ecclesiastes",
    totalChapter: 12,
  },
  {
    name: "The Song of Songs",
    totalChapter: 8,
  },
  {
    name: "Isaiah",
    totalChapter: 66,
  },
  {
    name: "Jeremiah",
    totalChapter: 52,
  },
  {
    name: "Lamentations",
    totalChapter: 5,
  },
  {
    name: "Ezekiel",
    totalChapter: 48,
  },
  {
    name: "Daniel",
    totalChapter: 12,
  },
  {
    name: "Hosea",
    totalChapter: 14,
  },
  {
    name: "Joel",
    totalChapter: 3,
  },
  {
    name: "Amos",
    totalChapter: 9,
  },
  {
    name: "Obadiah",
    totalChapter: 1,
  },
  {
    name: "Jonah",
    totalChapter: 4,
  },
  {
    name: "Micah",
    totalChapter: 7,
  },
  {
    name: "Nahum",
    totalChapter: 3,
  },
  {
    name: "Habakkuk",
    totalChapter: 3,
  },
  {
    name: "Zephaniah",
    totalChapter: 3,
  },
  {
    name: "Haggai",
    totalChapter: 2,
  },
  {
    name: "Zechariah",
    totalChapter: 14,
  },
  {
    name: "Malachi",
    totalChapter: 4,
  },
  {
    name: "Matthew",
    totalChapter: 28,
  },
  {
    name: "Mark",
    totalChapter: 16,
  },
  {
    name: "Luke",
    totalChapter: 24,
  },
  {
    name: "John",
    totalChapter: 21,
  },
  {
    name: "Acts",
    totalChapter: 28,
  },
  {
    name: "Romans",
    totalChapter: 16,
  },
  {
    name: "1 Corinthians",
    totalChapter: 16,
  },
  {
    name: "2 Corinthians",
    totalChapter: 13,
  },
  {
    name: "Galatians",
    totalChapter: 6,
  },
  {
    name: "Ephesians",
    totalChapter: 6,
  },
  {
    name: "Philippians",
    totalChapter: 4,
  },
  {
    name: "Colossians",
    totalChapter: 4,
  },
  {
    name: "1 Thessalonians",
    totalChapter: 5,
  },
  {
    name: "2 Thessalonians",
    totalChapter: 3,
  },
  {
    name: "1 Timothy",
    totalChapter: 6,
  },
  {
    name: "2 Timothy",
    totalChapter: 4,
  },
  {
    name: "Titus",
    totalChapter: 3,
  },
  {
    name: "Philemon",
    totalChapter: 1,
  },
  {
    name: "Hebrews",
    totalChapter: 13,
  },
  {
    name: "James",
    totalChapter: 5,
  },
  {
    name: "1 Peter",
    totalChapter: 5,
  },
  {
    name: "2 Peter",
    totalChapter: 3,
  },
  {
    name: "1 John",
    totalChapter: 5,
  },
  {
    name: "2 John",
    totalChapter: 1,
  },
  {
    name: "3 John",
    totalChapter: 1,
  },
  {
    name: "Jude",
    totalChapter: 1,
  },
  {
    name: "Revelation",
    totalChapter: 22,
  },
];

const processItemsInChunks = async (
  items,
  fn,
  chunkSize = 1000,
  maxRetries = 10
) => {
  const result = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    const chunkResults = await Promise.all(
      chunk.map(async (item) => {
        let retries = 0;
        let success = false;
        let result;

        while (!success && retries < maxRetries) {
          try {
            result = await fn(item);
            success = true;
          } catch (error) {
            console.log(error);
            console.log(
              `Chunk item processing failed. Retrying... (${
                retries + 1
              }/${maxRetries})`
            );
            retries++;
          }
        }

        if (!success) {
          console.log(
            `Chunk item processing failed after ${maxRetries} retries. Skipping item.`
          );
          return null;
        }

        return result;
      })
    );

    result.push(...chunkResults.filter((item) => item !== null));
  }

  return result;
};

const getBibled = async (name, totalChapter) => {
  const headers = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua":
      '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    cookie:
      "_ga=GA1.1.1742472559.1693128285; cf_clearance=V_WUHRbALvSfXzeKyoWaQAHG.kVIdUt0iod_i80r7YI-1698577612-0-1-d6959b21.57b14ace.768643c4-0.2.1698577612; _ga_FW3E8ZGSTK=GS1.1.1698577610.11.1.1698577613.0.0.0; TawkConnectionTime=0; twk_uuid_5efccb2d4a7c6258179bb4eb=%7B%22uuid%22%3A%221.2BiStNPy88lz404c5JeMJv0FoFX5PpsFgrPUuAJVaxbueluo20942NTp1sjHmIXGnZePzyB3ECmFgN98qI1Lt3IXq84so4z2rCEjEtdX2F2bklQOrvzxOLFxPqN%22%2C%22version%22%3A3%2C%22domain%22%3A%22allstreamhub.com%22%2C%22ts%22%3A1698577617492%7D",
    Referer: "https://allstreamhub.com/dashboard",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  const response = await axios.post(
    `https://allstreamhub.com/bible/${name}/${totalChapter}`,
    {
      headers,
    }
  );

  // Handle the response here
  return response.data;
};

const run = async () => {
  for (let i = 0; i < newChaptersWithTotalVerses.length; i++) {
    const { name, totalChapter } = newChaptersWithTotalVerses[i];

    const runs = async (n) => {
      const bible = await getBibled(n.name, n.chapter);

      fs.mkdirSync(`${saveDirectory}/${n.name}`, { recursive: true });

      fs.writeFileSync(
        `${saveDirectory}/${n.name}/${n.chapter}.json`,
        JSON.stringify(bible, null, 2)
      );
    };
    c;
    const totalChapterArray = Array.from(Array(totalChapter + 1).keys()).slice(
      1
    );

    await processItemsInChunks(
      totalChapterArray.map((u) => ({
        name: name,
        chapter: u,
      })),
      runs
    );
  }
};

run();
