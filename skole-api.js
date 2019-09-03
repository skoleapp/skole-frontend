import { updatePet } from './openapi/api';

const PROD_BASE_PATH = 'https://api.skole.fi/';
const DEV_BASE_PATH = 'http://localhost:8000/api';

const apiBasePath = () => (process.env.NODE_ENV === 'development' ? DEV_BASE_PATH : PROD_BASE_PATH);

const apiFactory = module => {
  return function() {
    const apiInstance = new module();
    apiInstance.apiClient.basePath = apiBasePath;
    return apiInstance;
  };
};

// TODO: Add API endpoints like below
const SkoleApi = {
  UpdatePetAPI: apiFactory(updatePet)
};

export default SkoleApi;
