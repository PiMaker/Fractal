package org.apache.cordova.media;

import java.lang.reflect.Method;

public class GrabAudio {
  public static int snoop(short [] outData, int kind){
try {
  Class c = MediaPlayer.class;
  Method m = c.getMethod("snoop", outData.getClass(), Integer.TYPE);
  m.setAccessible(true);
  m.invoke(c, outData, kind);
  return 0;
} catch (Exception e) {
  // TODO Auto-generated catch block
  e.printStackTrace();
  return 1;
}
}
}
