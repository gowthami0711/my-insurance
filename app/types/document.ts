export type DocumentFile = {
    id: string;
    name: string;
    size: number;
    pages: number;
    key: string;
    customerId: string;
    viewUrl?: string;
    createdAt: string;
    _count: {
      annotations: number;
      comments: number;
    };
  };
  
  export type Comment = {
    id: string;
    documentId: string;
    page: number;
    content: string;
    author: string;
    createdAt: string;
  };
  
  export type Annotation = {
    id: string;
    documentId: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    note: string | null;
    author: string;
    createdAt: string;
  };