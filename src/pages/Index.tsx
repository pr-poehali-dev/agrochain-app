import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [fields, setFields] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [totalArea, setTotalArea] = useState(0)
  const [readyForHarvest, setReadyForHarvest] = useState(0)
  const [loading, setLoading] = useState(true)
  const [newFieldData, setNewFieldData] = useState({ name: '', area: '', crop: '' })

  // Функция загрузки данных из API
  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://functions.poehali.dev/74c76e4e-00b1-4fab-bce4-340170b29c16')
      if (!response.ok) throw new Error('Ошибка загрузки данных')
      
      const data = await response.json()
      setFields(data.fields || [])
      setUpcomingEvents(data.events || [])
      setTotalArea(data.total_area || 0)
      setReadyForHarvest(data.ready_for_harvest || 0)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  // Функция добавления нового поля
  const addNewField = async () => {
    if (!newFieldData.name || !newFieldData.area || !newFieldData.crop) {
      alert('Заполните все поля')
      return
    }

    try {
      const response = await fetch('https://functions.poehali.dev/74c76e4e-00b1-4fab-bce4-340170b29c16', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFieldData.name,
          area: parseFloat(newFieldData.area),
          crop: newFieldData.crop
        })
      })

      if (!response.ok) throw new Error('Ошибка добавления поля')
      
      // Перезагружаем данные
      await loadData()
      
      // Очищаем форму
      setNewFieldData({ name: '', area: '', crop: '' })
      
      alert('Поле успешно добавлено!')
    } catch (error) {
      console.error('Ошибка добавления поля:', error)
      alert('Ошибка при добавлении поля')
    }
  }

  // Загрузка данных при загрузке компонента
  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return 'bg-grass-200 text-grass-800'
      case 'growing': return 'bg-forest-200 text-forest-800'
      case 'harvest-ready': return 'bg-earth-200 text-earth-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planted': return 'Посажено'
      case 'growing': return 'Растёт'
      case 'harvest-ready': return 'Готов к уборке'
      default: return 'Неизвестно'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 to-forest-50">
      {/* Навигационная панель */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://cdn.poehali.dev/files/6bc9b786-7608-4b9f-9298-c4b43f894e7b.png" 
                  alt="AgroChain Logo" 
                  className="w-10 h-10 rounded-lg"
                />
                <h1 className="text-2xl font-bold text-forest-800">AgroChain</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Icon name="Bell" size={16} className="mr-2" />
                Уведомления
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-forest-500 data-[state=active]:text-white">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="fields" className="data-[state=active]:bg-forest-500 data-[state=active]:text-white">
              <Icon name="MapPin" size={16} className="mr-2" />
              Поля
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-forest-500 data-[state=active]:text-white">
              <Icon name="Calendar" size={16} className="mr-2" />
              События
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-forest-500 data-[state=active]:text-white">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Рынок
            </TabsTrigger>
          </TabsList>

          {/* Дашборд */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Информационный блок о платформе */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-600 via-forest-500 to-grass-500 text-white mb-8">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 px-8 py-12">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Добро пожаловать в AgroChain! 🌱
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white/90">
                    Цифровая платформа для современного сельского хозяйства
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Icon name="MapPin" size={40} className="mx-auto mb-3 text-white" />
                      <h3 className="font-semibold text-lg mb-2">Управление полями</h3>
                      <p className="text-white/80 text-sm">Отслеживайте все ваши участки на интерактивной карте</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Icon name="TrendingUp" size={40} className="mx-auto mb-3 text-white" />
                      <h3 className="font-semibold text-lg mb-2">Аналитика урожая</h3>
                      <p className="text-white/80 text-sm">Получайте детальную статистику и прогнозы</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Icon name="Users" size={40} className="mx-auto mb-3 text-white" />
                      <h3 className="font-semibold text-lg mb-2">Поиск покупателей</h3>
                      <p className="text-white/80 text-sm">Находите лучшие предложения для продажи урожая</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Галерея преимуществ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/70 backdrop-blur-sm border-forest-200 overflow-hidden">
                <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/img/d7b959bb-9dd2-4477-b29f-d29ad3638483.jpg')"}}>
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Контроль территории</h3>
                      <p className="text-white/90">Полный обзор ваших земельных угодий</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-forest-200 overflow-hidden">
                <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/img/6ed140d1-e7ed-4668-861a-ed8a5b58fb19.jpg')"}}>
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Умные технологии</h3>
                      <p className="text-white/90">Современные решения для эффективного земледелия</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-forest-200 overflow-hidden">
                <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/img/54b424d8-7554-4db4-977f-4ebb03b5c183.jpg')"}}>
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Богатый урожай</h3>
                      <p className="text-white/90">Максимизируйте прибыль от продажи продукции</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Основная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-forest-700">Всего полей</CardTitle>
                  <Icon name="MapPin" className="h-4 w-4 text-forest-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-forest-800">
                    {loading ? '...' : fields.length}
                  </div>
                  <p className="text-xs text-forest-600">
                    {loading ? 'Загрузка...' : `${totalArea.toFixed(1)} га общей площади`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-forest-700">Готов к уборке</CardTitle>
                  <Icon name="Package" className="h-4 w-4 text-earth-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-earth-800">
                    {loading ? '...' : readyForHarvest}
                  </div>
                  <p className="text-xs text-earth-600">
                    {loading ? 'Загрузка...' : 'полей требует внимания'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-forest-700">Основная культура</CardTitle>
                  <Icon name="Wheat" className="h-4 w-4 text-grass-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-grass-800">
                    {loading ? 'Загрузка...' : (fields.length > 0 ? fields[0].crop : 'Нет данных')}
                  </div>
                  <p className="text-xs text-grass-600">
                    {loading ? '...' : (fields.length > 0 ? `${fields[0]?.area || 0} га засеяно` : 'Добавьте поля')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-forest-700">Предстоящие задачи</CardTitle>
                  <Icon name="Clock" className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-800">
                    {loading ? '...' : upcomingEvents.length}
                  </div>
                  <p className="text-xs text-orange-600">
                    {loading ? 'Загрузка...' : 'на ближайшие дни'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Обзор полей */}
            <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
              <CardHeader>
                <CardTitle className="text-forest-800">Обзор полей</CardTitle>
                <CardDescription className="text-forest-600">
                  Состояние ваших полей и прогресс выращивания
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={32} className="text-forest-500 animate-spin mx-auto mb-2" />
                    <p className="text-forest-600">Загружаем данные о полях...</p>
                  </div>
                ) : fields.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Sprout" size={48} className="text-forest-400 mx-auto mb-4" />
                    <p className="text-forest-600">Пока нет добавленных полей</p>
                    <p className="text-sm text-forest-500 mt-2">Добавьте первое поле во вкладке "Поля"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {fields.map((field) => (
                    <div key={field.id} className="border border-forest-100 rounded-lg p-4 bg-white/50">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-forest-800">{field.name}</h3>
                        <Badge className={getStatusColor(field.status)}>
                          {getStatusText(field.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-forest-600">
                        <div className="flex justify-between">
                          <span>Площадь:</span>
                          <span className="font-medium">{field.area} га</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Культура:</span>
                          <span className="font-medium">{field.crop}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Прогресс роста</span>
                            <span>{field.progress}%</span>
                          </div>
                          <Progress value={field.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Предстоящие события */}
            <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
              <CardHeader>
                <CardTitle className="text-forest-800">Предстоящие события</CardTitle>
                <CardDescription className="text-forest-600">
                  Запланированные работы на полях
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={32} className="text-forest-500 animate-spin mx-auto mb-2" />
                    <p className="text-forest-600">Загружаем события...</p>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Calendar" size={48} className="text-forest-400 mx-auto mb-4" />
                    <p className="text-forest-600">Нет запланированных событий</p>
                    <p className="text-sm text-forest-500 mt-2">Добавьте мероприятия во вкладке "События"</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-forest-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                          <Icon name="Calendar" size={16} className="text-forest-600" />
                        </div>
                        <div>
                          <p className="font-medium text-forest-800">{event.action}</p>
                          <p className="text-sm text-forest-600">Поле "{event.field}"</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-forest-800">через {event.days} дней</p>
                        <p className="text-xs text-forest-600">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Управление полями */}
          <TabsContent value="fields" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-forest-800">Управление полями</h2>
                <p className="text-forest-600">Визуализация и управление вашими участками</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-forest-500 hover:bg-forest-600">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить поле
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Добавить новое поле</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о новом поле
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="field-name">Название поля</Label>
                      <Input 
                        id="field-name" 
                        placeholder="Например: Поле 'Западное'"
                        value={newFieldData.name}
                        onChange={(e) => setNewFieldData({...newFieldData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-area">Площадь (га)</Label>
                      <Input 
                        id="field-area" 
                        type="number" 
                        placeholder="25.5"
                        value={newFieldData.area}
                        onChange={(e) => setNewFieldData({...newFieldData, area: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-crop">Культура</Label>
                      <Select onValueChange={(value) => setNewFieldData({...newFieldData, crop: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите культуру" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Пшеница">Пшеница</SelectItem>
                          <SelectItem value="Картофель">Картофель</SelectItem>
                          <SelectItem value="Кукуруза">Кукуруза</SelectItem>
                          <SelectItem value="Ячмень">Ячмень</SelectItem>
                          <SelectItem value="Овёс">Овёс</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full bg-forest-500 hover:bg-forest-600"
                      onClick={addNewField}
                    >
                      Сохранить поле
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Карта-заглушка */}
            <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
              <CardContent className="p-6">
                <div className="h-96 bg-gradient-to-br from-grass-100 to-forest-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Map" size={64} className="text-forest-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-forest-700 mb-2">Карта полей</h3>
                    <p className="text-forest-600">Интерактивная карта с отображением ваших полей</p>
                    <Button className="mt-4 bg-forest-500 hover:bg-forest-600">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      Открыть карту
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* События */}
          <TabsContent value="events" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-forest-800">Журнал событий</h2>
                <p className="text-forest-600">Планирование и отслеживание операций</p>
              </div>
              <Button className="bg-forest-500 hover:bg-forest-600">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить событие
              </Button>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-forest-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                          <Icon name="Calendar" size={20} className="text-forest-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-forest-800">{event.action}</h3>
                          <p className="text-sm text-forest-600">Поле "{event.field}" • {event.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-forest-200 text-forest-700">
                        через {event.days} дней
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Рынок */}
          <TabsContent value="market" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-forest-800">Продажа урожая</h2>
                <p className="text-forest-600">Размещение объявлений и поиск покупателей</p>
              </div>
              <Button className="bg-forest-500 hover:bg-forest-600">
                <Icon name="Plus" size={16} className="mr-2" />
                Разместить объявление
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Мои объявления</CardTitle>
                  <CardDescription className="text-forest-600">
                    Активные предложения о продаже
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Icon name="Package" size={48} className="text-forest-400 mx-auto mb-4" />
                    <p className="text-forest-600">Пока нет активных объявлений</p>
                    <Button className="mt-4 bg-forest-500 hover:bg-forest-600">
                      Создать первое объявление
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Поиск покупателей</CardTitle>
                  <CardDescription className="text-forest-600">
                    Найдите лучшие предложения в вашем регионе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/50 rounded-lg border border-forest-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-forest-800">ООО "Зерно-Трейд"</h4>
                          <p className="text-sm text-forest-600">Пшеница • 25,000 ₽/т</p>
                        </div>
                        <Badge className="bg-grass-100 text-grass-800">12 км</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-white/50 rounded-lg border border-forest-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-forest-800">Агрокомбинат "Урожай"</h4>
                          <p className="text-sm text-forest-600">Картофель • 18,500 ₽/т</p>
                        </div>
                        <Badge className="bg-grass-100 text-grass-800">8 км</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};

export default Index;