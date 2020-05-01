#include <stdio.h>

#include <gphoto2/gphoto2-camera.h>

GPContext *context;

void g_wrap_error_func(GPContext *context, const char *format, void *data)
{
  fprintf(stderr, "*** Contexterror ***\n");
  fprintf(stderr, "\n");
}

void g_wrap_message_func(GPContext *context, const char *format, void *data)
{
  printf("\n");
}

int list_cameras()
{

  CameraList *list;
  int ret, count, i;
  const char *name, *value;
  context = gp_context_new();
  gp_context_set_error_func(context, g_wrap_error_func, NULL);
  gp_context_set_message_func(context, g_wrap_message_func, NULL);

  ret = gp_list_new (&list);
  if (ret < GP_OK) return 1;
  count = gp_camera_autodetect (list, context);
  if (count < GP_OK) {
    printf("autodetect No cameras detected.\n");
  }
  printf("autodetect count is %d\n", count);


  for (i = 0; i < count; i++) {
    gp_list_get_name  (list, i, &name);
    gp_list_get_value (list, i, &value);
    /* ret = sample_open_camera (&cams[i], name, value, context); */
    /* if (ret < GP_OK) fprintf(stderr,"Camera %s on port %s failed to open\n", name, value); */
    printf("Camera %s on port %s\n", name, value);
  }
  return 0;
}


int main() {
  printf("Welcome to balenaDSLR\n");
  list_cameras();
  return 0;
}
