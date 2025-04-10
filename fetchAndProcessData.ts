import axios from 'axios';

// Define an interface for the expected response structure
interface ApiResponse {
  id: number;
  name: string;
  items: {
    id: number;
    title: string;
    description?: string;
    price: number;
  }[];
  metadata?: {
    page: number;
    total: number;
  };
}

// Function to fetch and process data from API
async function fetchAndProcessData(apiUrl: string): Promise<void> {
  try {
    // Make GET request to the API
    const response = await axios.get<ApiResponse>(apiUrl);
    
    // Extract the JSON data
    const data = response.data;
    
    console.log('=== Basic Information ===');
    console.log(`ID: ${data.id}`);
    console.log(`Name: ${data.name}`);
    
    if (data.metadata) {
      console.log(`\n=== Metadata ===`);
      console.log(`Page: ${data.metadata.page}`);
      console.log(`Total Items: ${data.metadata.total}`);
    }
    
    console.log('\n=== Items ===');
    // Process and extract information from items array
    data.items.forEach((item, index) => {
      console.log(`\nItem ${index + 1}:`);
      console.log(`  Title: ${item.title}`);
      console.log(`  Price: $${item.price.toFixed(2)}`);
      if (item.description) {
        console.log(`  Description: ${item.description.substring(0, 50)}...`);
      }
    });
    
    // You could also return the extracted data
    // return {
    //   id: data.id,
    //   name: data.name,
    //   itemCount: data.items.length
    // };
    
  } catch (error) {
    console.error('Error fetching or processing data:');
    if (axios.isAxiosError(error)) {
      console.error(`HTTP error: ${error.response?.status} - ${error.message}`);
    } else {
      console.error((error as Error).message);
    }
  }
}

// Example usage
const API_URL = 'https://api.example.com/data';
fetchAndProcessData(API_URL);
