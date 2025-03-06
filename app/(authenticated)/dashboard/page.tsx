import { useUser } from '@clerk/nextjs';
import { Todo } from '@prisma/client';
import React, { useCallback, useState, useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import axios from 'axios';

function Dashboard() {
    const { user } = useUser();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const fetchTodos = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/todos?page=${page}&search=${debouncedSearchTerm}`);

            if (response.status !== 200) {
                throw new Error('Error fetching todos');
            }

            const data = response.data;

            setTodos(data.todos);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchTodos(currentPage);
        fetchSubscriptionStatus();
    }, [fetchTodos, currentPage]);

    const fetchSubscriptionStatus = async () => {
        try {
            const response = await axios.get(`/api/subscription`);

            if (response.status === 200) {
                const data = response.data;
                setIsSubscribed(data.isSubscribed);
            }
        } catch (error) {
            console.error('Error fetching subscription status:', error);
        }
    };

    const handleAddTodo = async (title: string) => {
        try {
            const response = await axios.post("/api/todos", JSON.stringify({ title }), {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status !== 200) {
                throw new Error('Error adding todo');
            }

            await fetchTodos(currentPage);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleUpdateTodo = async (id: number, completed: boolean) => {
        try {   
            const response = await axios.put(
                `/api/todos/${id}`, 
                JSON.stringify({ completed }), 
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error('Error updating todo');    
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            const response = await axios.delete(`/api/todos/${id}`);

            if (response.status !== 200) {
                throw new Error('Error deleting todo');
            }

            fetchTodos(currentPage);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return <div>Dashboard</div>;
}

export default Dashboard;
