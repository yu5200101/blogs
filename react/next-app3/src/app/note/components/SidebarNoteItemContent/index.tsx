'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import styles from './index.module.scss'
import React from 'react';
import classNames from 'classnames';
import Image from 'next/image'

interface SidebarNoteContentProps {
  id: string;
  title: string;
  children: React.ReactNode;
  expandedChildren: React.ReactNode;
}

export default function SidebarNoteContent({
  id,
  title,
  children,
  expandedChildren,
}: SidebarNoteContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const selectedId = pathname?.split('/')[1] || null

  const [isPending] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = id === selectedId

  // Animate after title is edited.
  const itemRef = useRef<HTMLDivElement>(null);
  const prevTitleRef = useRef<string>(title);

  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title;
      if (itemRef.current) {
        itemRef.current.classList.add('flash');
      }
    }
  }, [title]);

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        if (itemRef.current) {
          itemRef.current.classList.remove('flash');
        }
      }}
      className={classNames(
        styles.content,
        isExpanded ? styles['note-expanded'] : '',
      )}>
      {children}
      <button
        className={styles['content-open']}
        style={{
          backgroundColor: isPending
            ? '#efefef'
            : isActive
              ? '#468890'
              : '',
          border: isActive
            ? '1px solid #468890'
            : '1px solid transparent',
        }}
        onClick={() => {
          const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLInputElement | null;
          if (sidebarToggle) {
            sidebarToggle.checked = true
          }
          router.push(`/note/${id}`)
        }}>
        Open note for preview
      </button>
      <button
        className={styles['content-btn']}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
        {isExpanded ? (
          <Image
            src="/arrow-down.svg"
            width="10"
            height="10"
            alt="Collapse"
          />
        ) : (
          <Image src="/arrow-up.svg" width="10" height="10" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  );
}