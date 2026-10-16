import type { CourseTemplateContent } from '@/content/course-templates';
import { CourseDetail, type CourseDetailProps } from './CourseDetail';
import { HumanitiesTemplate } from './templates/HumanitiesTemplate';
import { MathTemplate } from './templates/MathTemplate';
import { ShortAnswerTemplate } from './templates/ShortAnswerTemplate';

interface Props extends CourseDetailProps { content: CourseTemplateContent | null; enabled: boolean; }

export function CourseDetailRouter({ content, enabled, ...props }: Props) {
  if (!enabled || content === null) return <CourseDetail {...props} />;
  if (content.templateType === 'humanities') return <HumanitiesTemplate {...props} content={content} />;
  if (content.templateType === 'math') return <MathTemplate {...props} content={content} />;
  return <ShortAnswerTemplate {...props} content={content} />;
}
