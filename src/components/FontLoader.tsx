import React, {useEffect, useState} from 'react';
import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';
import {BODY_FONT, FONT_FILES, HEADING_FONT} from '../theme/fonts.ts';

/**
 * Loads the display and body faces before the first frame is drawn, so no
 * frame is ever rendered with a fallback face.
 */
export const FontLoader: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('Loading fonts'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadFont({family: HEADING_FONT, url: staticFile(FONT_FILES.headingRegular), weight: '400'}),
      loadFont({family: HEADING_FONT, url: staticFile(FONT_FILES.headingItalic), weight: '400', style: 'italic'}),
      loadFont({family: BODY_FONT, url: staticFile(FONT_FILES.bodyLight), weight: '300'}),
      loadFont({family: BODY_FONT, url: staticFile(FONT_FILES.bodyRegular), weight: '400'}),
      loadFont({family: BODY_FONT, url: staticFile(FONT_FILES.bodyMedium), weight: '500'}),
      loadFont({family: BODY_FONT, url: staticFile(FONT_FILES.bodySemiBold), weight: '600'}),
    ])
      .then(() => {
        if (!cancelled) {
          setReady(true);
          continueRender(handle);
        }
      })
      .catch((error: unknown) => {
        console.error('[fonts] A font file could not be loaded, falling back to the system stack.', error);
        if (!cancelled) {
          setReady(true);
          continueRender(handle);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (!ready) {
    return null;
  }
  return <>{children}</>;
};
