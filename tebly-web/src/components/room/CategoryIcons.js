import Appointment from '../../assets/category/appointment.svg?react';
import AppointmentSelected from '../../assets/category/appointment_selected.svg?react';
import Club from '../../assets/category/club.svg?react';
import ClubSelected from '../../assets/category/club_selected.svg?react';
import Family from '../../assets/category/family.svg?react';
import FamilySelected from '../../assets/category/famliy_selected.svg?react';
import SelfStudy from '../../assets/category/selfstudy.svg?react';
import SelfStudySelected from '../../assets/category/selfstudy_selected.svg?react';
import Work from '../../assets/category/work.svg?react';
import WorkSelected from '../../assets/category/work_selected.svg?react';
import Class from '../../assets/category/class.svg?react';
import ClassSelected from '../../assets/category/class_selected.svg?react';
import Free from '../../assets/category/free.svg?react';
import FreeSelected from '../../assets/category/free_selected.svg?react';
import TeamProject from '../../assets/category/teamproject.svg?react';
import TeamProjectSelected from '../../assets/category/teamproject_selected.svg?react';
import Others from '../../assets/category/others.svg?react';
import OthersSelected from '../../assets/category/others_selected.svg?react';

// CategoryPopup에서 사용
export const CATEGORY_ICON_MAP = {
  Appointment: { Icon: Appointment, SelectedIcon: AppointmentSelected },
  Club: { Icon: Club, SelectedIcon: ClubSelected },
  Family: { Icon: Family, SelectedIcon: FamilySelected },
  SelfDevelopment: { Icon: SelfStudy, SelectedIcon: SelfStudySelected },
  Work: { Icon: Work, SelectedIcon: WorkSelected },
  Class: { Icon: Class, SelectedIcon: ClassSelected },
  Leisure: { Icon: Free, SelectedIcon: FreeSelected },
  TeamProject: { Icon: TeamProject, SelectedIcon: TeamProjectSelected },
  Other: { Icon: Others, SelectedIcon: OthersSelected },
};

export const CATEGORY_KO = {
  Appointment: '약속',
  Club: '동아리',
  Family: '가족',
  SelfDevelopment: '자기계발',
  Work: '업무',
  Class: '수업',
  Leisure: '여가',
  TeamProject: '팀 프로젝트',
  Other: '기타',
};

// CreateCategoryPopup에서 사용
export const CATEGORY_ICONS = [
  { id: 'Appointment', Icon: AppointmentSelected },
  { id: 'Club', Icon: ClubSelected },
  { id: 'Family', Icon: FamilySelected },
  { id: 'SelfDevelopment', Icon: SelfStudySelected },
  { id: 'Work', Icon: WorkSelected },
  { id: 'Class', Icon: ClassSelected },
  { id: 'Leisure', Icon: FreeSelected },
  { id: 'TeamProject', Icon: TeamProjectSelected },
  { id: 'Other', Icon: OthersSelected },
];