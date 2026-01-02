export interface StatusOption {
    label: string;
    value: string;
    color: string;
}

export interface PriorityOption {
    label: string;
    value: string;
    color: string;
}

export interface Settings {
    statuses: StatusOption[];
    priorities: PriorityOption[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    status: string; // Changed from literal union to string
    priority: string; // Changed from literal union to string
    created_by: string;

    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    settings?: Settings;
}
