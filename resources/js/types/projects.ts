import { Project } from './project';
import { Meta } from './tasks';

export interface Projects {
    current_page: number;
    data: Project[];
    meta: Meta;
}
