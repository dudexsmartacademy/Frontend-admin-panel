import { getStorageData, setStorageData } from '../utils/storage';

export interface BatchConfig {
  id: string;
  name: string;
  studentLimit: number;
}

export interface AcademicCollege {
  id: string;
  collegeName: string;
  code: string;
  campusLocation?: string;
  establishedYear?: string;
  degrees: string[];
  specializations: string[];
  batches: BatchConfig[];
  batchLimit: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const STORAGE_KEY = 'dudex_academic_colleges';
const CHANGE_EVENT = 'dudex_academic_colleges_changed';

export const initialColleges: AcademicCollege[] = [
  {
    id: 'COL-001',
    collegeName: 'DudeX Institute of Technology',
    code: 'DIT-01',
    campusLocation: 'Innovation Tech Park, Campus A',
    establishedYear: '2020',
    degrees: ['B.Tech', 'M.Tech', 'BCA', 'MCA'],
    specializations: ['CSE', 'AI & DS', 'Cyber Security', 'Information Technology'],
    batches: [
      { id: 'b1', name: 'Batch 1', studentLimit: 60 },
      { id: 'b2', name: 'Batch 2', studentLimit: 60 },
      { id: 'b3', name: 'Batch 3', studentLimit: 60 },
    ],
    batchLimit: 60,
    status: 'Active',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'COL-002',
    collegeName: 'DudeX College of Engineering',
    code: 'DCE-02',
    campusLocation: 'South Campus, Block B',
    establishedYear: '2021',
    degrees: ['B.Tech', 'M.Tech'],
    specializations: ['CSE', 'AI & DS', 'Cyber Security'],
    batches: [
      { id: 'b4', name: 'Batch 1', studentLimit: 50 },
      { id: 'b5', name: 'Batch 2', studentLimit: 50 },
    ],
    batchLimit: 50,
    status: 'Active',
    createdAt: '2024-02-10T10:30:00.000Z',
  },
  {
    id: 'COL-003',
    collegeName: 'Apex Institute of Technology',
    code: 'AIT-03',
    campusLocation: 'Metro Tech Hub, Tower 3',
    establishedYear: '2019',
    degrees: ['B.Tech', 'BCA'],
    specializations: ['CSE', 'Information Technology'],
    batches: [
      { id: 'b6', name: 'Batch 1', studentLimit: 60 },
      { id: 'b7', name: 'Batch 2', studentLimit: 60 },
    ],
    batchLimit: 60,
    status: 'Active',
    createdAt: '2024-03-01T11:00:00.000Z',
  },
  {
    id: 'COL-004',
    collegeName: 'National Institute of Design & Tech',
    code: 'NIDT-04',
    campusLocation: 'North Science District',
    establishedYear: '2018',
    degrees: ['B.Tech', 'B.Sc'],
    specializations: ['CSE', 'AI & DS'],
    batches: [
      { id: 'b8', name: 'Batch 1', studentLimit: 45 },
    ],
    batchLimit: 45,
    status: 'Active',
    createdAt: '2024-03-20T08:45:00.000Z',
  },
];

function notifyChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export const academicService = {
  getColleges(): AcademicCollege[] {
    const data = getStorageData<AcademicCollege[]>(STORAGE_KEY, []);
    if (!data || data.length === 0) {
      setStorageData(STORAGE_KEY, initialColleges);
      return initialColleges;
    }
    return data;
  },

  getCollegeById(id: string): AcademicCollege | undefined {
    return this.getColleges().find((c) => c.id === id);
  },

  getCollegeByName(name: string): AcademicCollege | undefined {
    return this.getColleges().find(
      (c) => c.collegeName.toLowerCase().trim() === name.toLowerCase().trim()
    );
  },

  createCollege(
    collegeData: Omit<AcademicCollege, 'id' | 'createdAt'>
  ): AcademicCollege {
    const colleges = this.getColleges();
    const newCollege: AcademicCollege = {
      ...collegeData,
      id: `COL-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCollege, ...colleges];
    setStorageData(STORAGE_KEY, updated);
    notifyChange();
    return newCollege;
  },

  updateCollege(
    id: string,
    updates: Partial<AcademicCollege>
  ): AcademicCollege | null {
    const colleges = this.getColleges();
    const index = colleges.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCollege: AcademicCollege = {
      ...colleges[index],
      ...updates,
    };
    colleges[index] = updatedCollege;
    setStorageData(STORAGE_KEY, colleges);
    notifyChange();
    return updatedCollege;
  },

  deleteCollege(id: string): boolean {
    const colleges = this.getColleges();
    const filtered = colleges.filter((c) => c.id !== id);
    if (filtered.length === colleges.length) return false;
    setStorageData(STORAGE_KEY, filtered);
    notifyChange();
    return true;
  },

  getAllColleges(): string[] {
    const colleges = this.getColleges();
    const names = new Set<string>();
    colleges.forEach((c) => {
      if (c.collegeName) names.add(c.collegeName.trim());
    });
    return Array.from(names);
  },

  getDegreesForCollege(collegeName?: string): string[] {
    const colleges = this.getColleges();
    const degrees = new Set<string>();

    if (collegeName) {
      const found = colleges.find(
        (c) => c.collegeName.toLowerCase().trim() === collegeName.toLowerCase().trim()
      );
      if (found) {
        found.degrees.forEach((d) => degrees.add(d.trim()));
        return Array.from(degrees);
      }
    }

    // If no college selected or found, aggregate all degrees
    colleges.forEach((c) => {
      c.degrees.forEach((d) => degrees.add(d.trim()));
    });
    // Add standard fallbacks if empty
    if (degrees.size === 0) {
      ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc'].forEach((d) => degrees.add(d));
    }
    return Array.from(degrees);
  },

  getSpecializationsForCollege(collegeName?: string): string[] {
    const colleges = this.getColleges();
    const specs = new Set<string>();

    if (collegeName) {
      const found = colleges.find(
        (c) => c.collegeName.toLowerCase().trim() === collegeName.toLowerCase().trim()
      );
      if (found) {
        found.specializations.forEach((s) => specs.add(s.trim()));
        return Array.from(specs);
      }
    }

    // If no college selected, aggregate all
    colleges.forEach((c) => {
      c.specializations.forEach((s) => specs.add(s.trim()));
    });
    if (specs.size === 0) {
      ['CSE', 'AI & DS', 'Cyber Security', 'Information Technology'].forEach((s) => specs.add(s));
    }
    return Array.from(specs);
  },

  getBatchesForCollege(collegeName?: string): string[] {
    const colleges = this.getColleges();
    const batches = new Set<string>();

    if (collegeName) {
      const found = colleges.find(
        (c) => c.collegeName.toLowerCase().trim() === collegeName.toLowerCase().trim()
      );
      if (found) {
        found.batches.forEach((b) => batches.add(b.name.trim()));
        return Array.from(batches);
      }
    }

    colleges.forEach((c) => {
      c.batches.forEach((b) => batches.add(b.name.trim()));
    });
    if (batches.size === 0) {
      ['Batch 1', 'Batch 2', 'Batch 3'].forEach((b) => batches.add(b));
    }
    return Array.from(batches);
  },

  getAllBatches(): string[] {
    const colleges = this.getColleges();
    const batches = new Set<string>();
    colleges.forEach((c) => {
      c.batches.forEach((b) => batches.add(b.name.trim()));
    });
    if (batches.size === 0) {
      ['Batch 1', 'Batch 2', 'Batch 3'].forEach((b) => batches.add(b));
    }
    return Array.from(batches);
  },

  onAcademicChange(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(CHANGE_EVENT, callback);
      window.removeEventListener('storage', callback);
    };
  },
};
