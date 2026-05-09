'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
  Search,
  Filter,
  ListTodo,
  Inbox,
  CalendarDays
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'
import type { Task } from '@/types/database'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_at', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      toast.error('Failed to update task')
    } else {
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened')
      fetchTasks()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-warning text-warning-foreground'
      case 'medium': return 'bg-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="size-5 text-success" />
      case 'in-progress': return <Clock className="size-5 text-warning" />
      default: return <Circle className="size-5 text-muted-foreground" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    switch (filter) {
      case 'today':
        return task.due_at && isToday(new Date(task.due_at))
      case 'upcoming':
        return task.due_at && !isPast(new Date(task.due_at)) && !isToday(new Date(task.due_at))
      case 'overdue':
        return task.due_at && isPast(new Date(task.due_at)) && task.status !== 'completed'
      case 'completed':
        return task.status === 'completed'
      default:
        return true
    }
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.due_at && isPast(new Date(t.due_at)) && t.status !== 'completed').length,
    today: tasks.filter(t => t.due_at && isToday(new Date(t.due_at))).length
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your team&apos;s tasks and follow-ups
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white border-0">
              <Plus className="mr-2 size-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Task title..." />
              <Input type="date" />
              <Button className="w-full gradient-primary text-white border-0">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <ListTodo className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <CalendarDays className="size-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="size-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <CheckCircle2 className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter} className="w-auto">
          <TabsList className="bg-card/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task List */}
      <Card className="bg-card/30 border-border/30">
        <CardContent className="p-0">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Inbox className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">No tasks found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Create your first task to get started'
                  : 'No tasks match the current filter'
                }
              </p>
              <Button variant="outline">
                <Plus className="mr-2 size-4" />
                Create Task
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className="flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium truncate ${
                        task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {task.title}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {task.due_at && (
                      <div className={`flex items-center gap-1.5 text-sm ${
                        isPast(new Date(task.due_at)) && task.status !== 'completed'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}>
                        <Calendar className="size-4" />
                        {isToday(new Date(task.due_at)) 
                          ? 'Today'
                          : isTomorrow(new Date(task.due_at))
                          ? 'Tomorrow'
                          : format(new Date(task.due_at), 'MMM d')
                        }
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Assign To</DropdownMenuItem>
                        <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
