interface DatasetItem {
  impressions?: number;
  engagements?: number;
}

export const getER = (dataset: DatasetItem[]) => {
  const totalImp = dataset.reduce(
    (acc, curr) => acc + (curr.impressions || 0),
    0,
  );
  const totalEng = dataset.reduce(
    (acc, curr) => acc + (curr.engagements || 0),
    0,
  );
  return totalImp > 0 ? (totalEng / totalImp) * 100 : 0;
};
