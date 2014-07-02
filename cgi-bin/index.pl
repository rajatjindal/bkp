#!"C:\xampp\perl\bin\perl.exe"

use strict;
use warnings;
use CGI;
use lib "./lib";
use Users;
use Data::Dump qw(dump);

my $q = CGI->new();
my $method = lc($ENV{'REQUEST_METHOD'});
my $path = $ENV{'REQUEST_URI'};
my $data = $q->param('POSTDATA');

print $q->header;
print "Hello";
print dump($data);