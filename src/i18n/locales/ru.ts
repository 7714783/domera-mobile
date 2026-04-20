import type { en } from './en';

// Strict shape — keeps RU in sync with the canonical English tree.
export const ru: typeof en = {
  common: {
    loading: 'Загрузка…',
    retry: 'Повторить',
    cancel: 'Отмена',
    save: 'Сохранить',
    empty: 'Пусто',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз.',
    offline: 'Нет связи. Показаны сохранённые данные.',
    unknown: 'Неизвестно',
  },
  auth: {
    loginTitle: 'Вход в Domera',
    email: 'Email',
    password: 'Пароль',
    submit: 'Войти',
    invalid: 'Неверные учётные данные',
    logout: 'Выйти',
  },
  nav: {
    home: 'Главная',
    tasks: 'Мои задачи',
    scanner: 'Сканер',
    notifications: 'Входящие',
    profile: 'Профиль',
    settings: 'Настройки',
    buildings: 'Здания',
  },
  tasks: {
    title: 'Мои задачи',
    emptyTitle: 'Нет назначенных задач',
    emptyBody: 'Когда руководитель назначит вам работу, она появится здесь.',
    transitionTo: 'Перевести в',
    addComment: 'Добавить комментарий',
    attachPhoto: 'Прикрепить фото',
  },
  scanner: {
    title: 'Сканировать QR',
    instruction: 'Наведите камеру на QR на оборудовании, табличке помещения или наряде.',
    permissionDenied: 'Нет доступа к камере. Разрешите в Настройках системы.',
    permissionRequest: 'Разрешить камеру',
    unknownCode: 'Код не распознан. Попробуйте другой QR.',
    rescan: 'Сканировать снова',
  },
  notifications: {
    title: 'Входящие',
    empty: 'Пока нет уведомлений.',
    permissionRequest: 'Включить push-уведомления',
    permissionDenied: 'Уведомления отключены. Включите их в настройках системы.',
  },
  access: {
    noAccess: 'Доступ ограничен',
    noAccessBody: 'У вас нет прав на этот экран.',
  },
};
