import { useQuery, useMutation, useQueryClient } from 'react-query';
import { monthlyReportsAPI } from '../services/api';

// Query keys
export const queryKeys = {
  monthlyReports: 'monthlyReports',
  monthlyReport: (id) => ['monthlyReport', id],
  projectReports: (projectId) => ['projectReports', projectId],
  statusReports: (status) => ['statusReports', status],
  pendingApproval: 'pendingApproval',
  highVariance: 'highVariance',
  statistics: 'statistics',
  dashboard: 'dashboard',
};

// Get all monthly reports
export const useMonthlyReports = () => {
  return useQuery(
    queryKeys.monthlyReports,
    () => monthlyReportsAPI.getAll(),
    {
      select: (response) => response.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Get monthly report by ID
export const useMonthlyReport = (id) => {
  return useQuery(
    queryKeys.monthlyReport(id),
    () => monthlyReportsAPI.getById(id),
    {
      enabled: !!id,
      select: (response) => response.data,
    }
  );
};

// Get reports by project
export const useProjectReports = (projectId) => {
  return useQuery(
    queryKeys.projectReports(projectId),
    () => monthlyReportsAPI.getByProject(projectId),
    {
      enabled: !!projectId,
      select: (response) => response.data,
    }
  );
};

// Get reports by status
export const useStatusReports = (status) => {
  return useQuery(
    queryKeys.statusReports(status),
    () => monthlyReportsAPI.getByStatus(status),
    {
      enabled: !!status,
      select: (response) => response.data,
    }
  );
};

// Get pending approval reports
export const usePendingApprovalReports = () => {
  return useQuery(
    queryKeys.pendingApproval,
    () => monthlyReportsAPI.getPendingApproval(),
    {
      select: (response) => response.data,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
};

// Get reports with high variance
export const useHighVarianceReports = (threshold = 1000) => {
  return useQuery(
    [queryKeys.highVariance, threshold],
    () => monthlyReportsAPI.getHighVariance(threshold),
    {
      select: (response) => response.data,
    }
  );
};

// Get statistics
export const useStatistics = () => {
  return useQuery(
    queryKeys.statistics,
    () => monthlyReportsAPI.getStatistics(),
    {
      select: (response) => response.data,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Get dashboard data
export const useDashboard = () => {
  return useQuery(
    queryKeys.dashboard,
    () => monthlyReportsAPI.getDashboard(),
    {
      select: (response) => response.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Create monthly report mutation
export const useCreateMonthlyReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data) => monthlyReportsAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.dashboard);
        queryClient.invalidateQueries(queryKeys.statistics);
      },
    }
  );
};

// Generate monthly report mutation
export const useGenerateMonthlyReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ projectId, year, month }) => monthlyReportsAPI.generate(projectId, year, month),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.dashboard);
        queryClient.invalidateQueries(queryKeys.statistics);
      },
    }
  );
};

// Update monthly report mutation
export const useUpdateMonthlyReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => monthlyReportsAPI.update(id, data),
    {
      onSuccess: (response, { id }) => {
        queryClient.invalidateQueries(queryKeys.monthlyReport(id));
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.dashboard);
      },
    }
  );
};

// Submit report mutation
export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => monthlyReportsAPI.submit(id),
    {
      onSuccess: (response, id) => {
        queryClient.invalidateQueries(queryKeys.monthlyReport(id));
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.pendingApproval);
        queryClient.invalidateQueries(queryKeys.dashboard);
      },
    }
  );
};

// Approve report mutation
export const useApproveReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => monthlyReportsAPI.approve(id),
    {
      onSuccess: (response, id) => {
        queryClient.invalidateQueries(queryKeys.monthlyReport(id));
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.pendingApproval);
        queryClient.invalidateQueries(queryKeys.dashboard);
      },
    }
  );
};

// Reject report mutation
export const useRejectReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => monthlyReportsAPI.reject(id),
    {
      onSuccess: (response, id) => {
        queryClient.invalidateQueries(queryKeys.monthlyReport(id));
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.pendingApproval);
        queryClient.invalidateQueries(queryKeys.dashboard);
      },
    }
  );
};

// Delete monthly report mutation
export const useDeleteMonthlyReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => monthlyReportsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.monthlyReports);
        queryClient.invalidateQueries(queryKeys.dashboard);
        queryClient.invalidateQueries(queryKeys.statistics);
      },
    }
  );
};
