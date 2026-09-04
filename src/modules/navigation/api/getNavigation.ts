import getAxios from '@/shared/lib/axios';

export interface ApiNavigationSubItem {
  title: string;
  url: string;
  icon: string;
}

export interface ApiNavigationItem {
  title: string;
  url: string;
  icon: string;
  items?: ApiNavigationSubItem[];
}

type GetNavigationResponse = {
  success: boolean;
  data: ApiNavigationItem[];
};

export const getNavigation = async (): Promise<ApiNavigationItem[]> => {
  const axios = getAxios();
  const response = await axios.get<GetNavigationResponse>('/profile');
  return response.data.data;
};
