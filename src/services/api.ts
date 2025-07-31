export const fetchArtworks = async (page = 1) => {
  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
    const json = await response.json();

    return {
      data: json.data,
      total: json.pagination.total,
    };
  } catch (error) {
    console.error('Failed to fetch artworks:', error);
    return {
      data: [],
      total: 0,
    };
  }
};
